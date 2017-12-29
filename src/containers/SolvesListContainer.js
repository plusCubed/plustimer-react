// @flow

import * as React from 'react';
import SolvesList, { Solve } from '../components/SolvesList';

import firebase from '../utils/firebase';
import * as firebaseUtils from '../utils/firebaseUtils';

type Props = {
  uid: string
};

type State = {
  solves: Solve[]
};

class SolvesListContainer extends React.PureComponent<Props, State> {
  state = {
    solves: []
  };
  puzzleCategoryUnsub = null;
  solvesUnsub = null;

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.uid !== prevProps.uid) {
      this.unsubscribe();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        solves: []
      });

      if (this.props.uid) {
        // User is signed in.
        firebaseUtils.onPuzzleCategoryChanged(
          this.props.uid,
          this.onPuzzleCategoryChanged
        );
      }
    }
  }

  async componentDidMount() {}

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.puzzleCategoryUnsub) {
      this.puzzleCategoryUnsub();
    }
    if (this.solvesUnsub) {
      this.solvesUnsub();
    }
  }

  onPuzzleCategoryChanged = async (puzzle, category, unsubscribe) => {
    this.puzzleCategoryUnsub = unsubscribe;

    const firestore = await firebase.firestore(this.props.uid);
    const ref = firestore
      .collection('users')
      .doc(this.props.uid)
      .collection('puzzles')
      .doc(puzzle)
      .collection('categories')
      .doc(category)
      .collection('solves');
    this.solvesUnsub = ref
      .orderBy('timestamp', 'desc')
      .onSnapshot(this.onCollectionUpdate);
  };

  onCollectionUpdate = querySnapshot => {
    const solves = [];
    querySnapshot.forEach(doc => {
      const solve = doc.data();
      solves.push({
        ...solve,
        id: doc.id
      });
    });
    this.setState({
      solves
    });
  };

  render() {
    return <SolvesList solves={this.state.solves} />;
  }
}

export default SolvesListContainer;
