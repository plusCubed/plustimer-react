// @flow

import * as React from 'react';
import SolvesList, { Solve } from '../components/SolvesList';
import firebase from '../utils/firebase';

type Props = {
  uid: string
};

type State = {
  solves: Solve[]
};

class SolvesListContainer extends React.PureComponent<void, State> {
  state = {
    solves: []
  };
  unsubscribe = null;

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.uid !== prevProps.uid) {
      if (this.props.uid) {
        this.unsubscribeSolves();
        // User is signed in.
        const firestore = await firebase.firestore();
        const ref = firestore
          .collection('users')
          .doc(this.props.uid)
          .collection('puzzles')
          .doc('333')
          .collection('categories')
          .doc('normal')
          .collection('solves');
        this.unsubscribe = ref
          .orderBy('timestamp', 'desc')
          .onSnapshot(this.onCollectionUpdate);
      } else {
        this.unsubscribeSolves();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          solves: []
        });
      }
    }
  }

  async componentDidMount() {}

  componentWillUnmount() {
    this.unsubscribeSolves();
  }

  unsubscribeSolves() {
    if (this.unsubscribe) {
      this.unsubscribe();
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
