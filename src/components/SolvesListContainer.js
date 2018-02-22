// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';
import { connect } from 'unistore/full/preact.es';
import Media from 'react-media';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';

import SolvesList from './SolvesList';
import type { Solve } from './SolvesList';
import Statistics from './Statistics';

import firebase from '../utils/firebase';

import style from './SolvesList.css';

type Props = {
  uid: string,
  puzzle: string,
  category: string
};

type State = {};

// 15 minutes
const TIME_BETWEEN_SESSIONS = 15 * 60 * 1000;

const actions = store => ({
  // Pass in solves in new->old order
  async updateSessions(state, solves: Solve[]) {
    let timestamp = Date.now();
    let sessionIndex = 0;
    const sessions = [[]];
    solves.forEach((solve, index) => {
      if (timestamp - solve.timestamp > TIME_BETWEEN_SESSIONS) {
        sessions.push([]);
        sessionIndex++;
      }
      sessions[sessionIndex].push(solve);
      timestamp = solve.timestamp;
    });
    store.setState({ sessions: sessions });
  }
});

@connect('uid,puzzle,category,sessions', actions)
class SolvesListContainer extends React.PureComponent<Props, State> {
  state = {
    current: true
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

  onCollectionUpdate = (querySnapshot: QuerySnapshot) => {
    const solves: Solve[] = [];
    querySnapshot.forEach(doc => {
      const solve = doc.data();
      solves.push({
        ...solve,
        id: doc.id
      });
    });

    this.props.updateSessions(solves);
  };

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

  handleSolvePenalty = (solve: Solve, penalty: number) => async () => {
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

  handleSolveDelete = (solve: Solve) => async () => {
    if (!this.props.uid || !this.props.puzzle || !this.props.category) {
      return;
    }

    const solveRef = await this.getSolveRef(solve);
    solveRef.delete();
  };

  handleHistoryClick = () => {
    this.setState({ current: !this.state.current });
  };

  render() {
    return (
      <div className={style.solves}>
        {this.state.current ? (
          <Media query="(min-width: 841px)" render={() => <Statistics />} />
        ) : null}
        <SolvesList
          sessions={
            this.state.current
              ? this.props.sessions.slice(0, 1)
              : this.props.sessions.slice(1)
          }
          onPenalty={this.handleSolvePenalty}
          onDelete={this.handleSolveDelete}
        />
        <Button
          onClick={this.handleHistoryClick}
          className={
            style.historyButton +
            ' ' +
            (!this.state.current ? style.active : '')
          }
          unelevated={!this.state.current}
        >
          <svg className={style.historyIcon} viewBox="0 0 24 24">
            <path d="M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z" />
          </svg>
        </Button>
      </div>
    );
  }
}

export default SolvesListContainer;
