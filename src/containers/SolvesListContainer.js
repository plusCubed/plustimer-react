// @flow

import * as React from 'react';
import SolvesList, { Solve } from '../components/SolvesList';

import firebase from '../utils/firebase';
import { onPuzzleCategoryChanged } from '../utils/firebase-utils';

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
  _unsubscribePuzzleCategory = null;
  _unsubscribeSolves = null;

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.uid !== prevProps.uid) {
      if (this.props.uid) {
        // User is signed in.
        onPuzzleCategoryChanged(async (puzzle, category, unsubscribe) => {
          this._unsubscribePuzzleCategory = unsubscribe;

          const firestore = await firebase.firestore();
          const ref = firestore
            .collection('users')
            .doc(this.props.uid)
            .collection('puzzles')
            .doc(puzzle)
            .collection('categories')
            .doc(category)
            .collection('solves');

          this.unsubscribeSolves();
          this._unsubscribeSolves = ref
            .orderBy('timestamp', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        }, this.props.uid);
      } else {
        this._unsubscribePuzzleCategory();
        this._unsubscribeSolves();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          solves: []
        });
      }
    }
  }

  async componentDidMount() {}

  componentWillUnmount() {
    this._unsubscribeSolves();
  }

  unsubscribePuzzleCategory() {
    if (this._unsubscribePuzzleCategory) {
      this._unsubscribePuzzleCategory();
    }
  }

  unsubscribeSolves() {
    if (this._unsubscribeSolves) {
      this._unsubscribeSolves();
    }
  }

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
