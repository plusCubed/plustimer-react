// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';
import { connect } from 'unistore/full/preact.es';

import SolvesList from '../components/SolvesList';
import type { Solve } from '../components/SolvesList';

import firebase from '../utils/firebase';

type Props = {
  uid: string,
  puzzle: string,
  category: string
};

type State = {
  solves: Solve[]
};

@connect('uid,puzzle,category')
class SolvesListContainer extends React.PureComponent<Props, State> {
  state = {
    solves: []
  };

  unsubscribeSolves = null;

  async componentDidUpdate(prevProps: Props) {
    if (
      (this.props.uid !== prevProps.uid ||
        this.props.puzzle !== prevProps.puzzle ||
        this.props.category !== prevProps.category) &&
      this.props.uid &&
      this.props.puzzle &&
      this.props.category
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
      this.unsubscribeSolves = ref
        .orderBy('timestamp', 'desc')
        .limit(1000)
        .onSnapshot(this.onCollectionUpdate);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.unsubscribeSolves) {
      this.unsubscribeSolves();
    }
  }

  async getSolveRef(solve) {
    const firestore = await firebase.firestore(this.props.uid);
    return firestore
      .collection('users')
      .doc(this.props.uid)
      .collection('puzzles')
      .doc(this.props.puzzle)
      .collection('categories')
      .doc(this.props.category)
      .collection('solves')
      .doc(solve.id);
  }

  handlePenalty = (solve: Solve, penalty: number) => async () => {
    if (!this.props.uid || !this.props.puzzle || !this.props.category) {
      return;
    }

    const solveRef = await this.getSolveRef(solve);

    solveRef.set(
      {
        penalty: penalty
      },
      { merge: true }
    );
  };

  handleDelete = (solve: Solve) => async () => {
    if (!this.props.uid || !this.props.puzzle || !this.props.category) {
      return;
    }

    const solveRef = await this.getSolveRef(solve);
    solveRef.delete();
  };

  onCollectionUpdate = (querySnapshot: QuerySnapshot) => {
    const solves: Solve[] = [];
    querySnapshot.forEach(doc => {
      const solve = doc.data();
      solves.push({
        ...solve,
        id: doc.id
      });
    });

    this.setState({ solves });
  };

  render() {
    return (
      <SolvesList
        solves={this.state.solves}
        onPenalty={this.handlePenalty}
        onDelete={this.handleDelete}
      />
    );
  }
}

export default SolvesListContainer;
