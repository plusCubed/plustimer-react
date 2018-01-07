// @flow

import * as React from 'react';
import { connect } from 'unistore/full/preact.es';

import SolvesList, { Solve } from '../components/SolvesList';

import firebase from '../utils/firebase';
import * as firebaseUtils from '../utils/firebaseUtils';
import * as preferences from '../utils/preferences';

type Props = {
  uid: string
};

type State = {
  solves: Solve[]
};

@connect('uid,puzzle,category')
class SolvesListContainer extends React.PureComponent<Props, State> {
  state = {
    solves: []
  };

  solvesUnsub = null;

  componentDidMount(prevProps) {}

  async componentDidUpdate(prevProps) {
    if (
      this.props.uid !== prevProps.uid ||
      this.props.puzzle !== prevProps.puzzle ||
      this.props.category !== prevProps.category
    ) {
      this.unsubscribe();

      const firestore = await firebase.firestore(this.props.uid);
      const ref = firestore
        .collection('users')
        .doc(this.props.uid)
        .collection('puzzles')
        .doc(this.props.puzzle)
        .collection('categories')
        .doc(this.props.category)
        .collection('solves');
      this.solvesUnsub = ref
        .orderBy('timestamp', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.solvesUnsub) {
      this.solvesUnsub();
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
