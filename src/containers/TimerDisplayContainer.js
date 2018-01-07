// @flow

import * as React from 'react';

import { connect } from 'unistore/full/preact.es';

import TimerDisplay, { TimerMode } from '../components/TimerDisplay';

import firebase from '../utils/firebase';
import * as firebaseUtils from '../utils/firebaseUtils';

import { Penalty } from '../components/SolvesList';

import scrambleService from '../utils/scrambleService';

export const TimerModeAction = {
  Down: 'down',
  Up: 'up',
  Cancel: 'cancel'
};

const transitionModeMap = {
  [TimerModeAction.Down]: {
    [TimerMode.Ready]: TimerMode.HandOnTimer,
    [TimerMode.Running]: TimerMode.Stopped
  },
  [TimerModeAction.Up]: {
    [TimerMode.HandOnTimer]: TimerMode.Running,
    [TimerMode.Stopped]: TimerMode.Ready
  },
  [TimerModeAction.Cancel]: {
    [TimerMode.HandOnTimer]: TimerMode.Ready,
    [TimerMode.Running]: TimerMode.Ready,
    [TimerMode.Stopped]: TimerMode.Ready
  }
};

export const transitionMode = (action: string, timerMode: string): string => {
  if (timerMode in transitionModeMap[action]) {
    const newMode = transitionModeMap[action][timerMode];
    if (newMode) {
      return newMode;
    }
  }
  return timerMode;
};

type Props = {
  uid: string,
  puzzle: string,
  category: string
};

type State = {
  startTime: number,
  displayTime: number,
  mode: string,
  currentScramble: string,
  nextScramble: string,
  scrambling: boolean
};

@connect('uid,puzzle,category')
class TimerDisplayContainer extends React.PureComponent<Props, State> {
  state = {
    startTime: -1,
    displayTime: 0,
    mode: TimerMode.Ready,
    currentScramble: ''
  };

  nextScramble = '';
  scrambling = false;

  animationFrameId = 0;

  async componentDidUpdate(prevProps) {
    if (
      (this.props.uid !== prevProps.uid ||
        this.props.puzzle !== prevProps.puzzle) &&
      this.props.puzzle
    ) {
      console.log('Puzzle changed');

      if (!this.scrambling) {
        await this.fetchScramble();
        await this.advanceScramble();
      }
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  handleDown = async () => {
    const currentMode = this.state.mode;
    const newMode = transitionMode(TimerModeAction.Down, currentMode);
    await this.transitionNewMode(currentMode, newMode);
  };

  handleUp = async () => {
    const currentMode = this.state.mode;
    const newMode = transitionMode(TimerModeAction.Up, currentMode);
    await this.transitionNewMode(currentMode, newMode);
  };

  async transitionNewMode(oldMode, newMode) {
    if (oldMode === newMode) {
      return;
    }

    const now = Math.trunc(performance.now());
    this.setState({ mode: newMode });

    switch (newMode) {
      case TimerMode.Ready:
        if (oldMode === TimerMode.Stopped) {
          await this.advanceScramble();
        }
        break;
      case TimerMode.HandOnTimer:
        this.resetTimer();
        break;
      case TimerMode.Running:
        this.startTimer(now);
        await this.fetchScramble();
        break;
      case TimerMode.Stopped:
        this.stopTimer(now);
        await this.addSolve(now);
        break;
      default:
        break;
    }
  }

  async addSolve(now) {
    if (!this.props.uid || !this.props.puzzle || !this.props.category) {
      return;
    }
    const firestore = await firebase.firestore(this.props.uid);
    const puzzleRef = firestore
      .collection('users')
      .doc(this.props.uid)
      .collection('puzzles')
      .doc(this.props.puzzle);
    const categoryRef = puzzleRef
      .collection('categories')
      .doc(this.props.category);
    const solvesRef = categoryRef.collection('solves');
    const docRef = await solvesRef.add({
      time: Math.floor(now - this.state.startTime),
      timestamp: new Date(),
      scramble: this.state.currentScramble,
      penalty: Penalty.NORMAL
    });
    console.log('Document written with ID: ', docRef.id);
  }

  async fetchScramble() {
    if (!this.props.uid || !this.props.puzzle) {
      return;
    }
    console.log('Fetching scramble');
    const firestore = await firebase.firestore(this.props.uid);
    const puzzleDoc = await firestore
      .collection('users')
      .doc(this.props.uid)
      .collection('puzzles')
      .doc(this.props.puzzle)
      .get();
    const scrambler = puzzleDoc.get('scrambler');
    this.scrambling = scrambleService.getScramble(scrambler).then(scramble => {
      console.log('Fetch scramble complete', scramble);
      this.nextScramble = scramble;
      this.scrambling = null;
    });
  }

  async advanceScramble() {
    if (this.scrambling) {
      await this.scrambling;
    }
    this.setState({
      currentScramble: this.nextScramble
    });
    console.log('Scramble advanced');
  }

  resetTimer() {
    this.setState({ displayTime: 0 });
  }

  startTimer(time) {
    this.setState({ startTime: time, displayTime: 0 });
    this.animationFrameId = window.requestAnimationFrame(this.timerLoop);
  }

  stopTimer(time) {
    window.cancelAnimationFrame(this.animationFrameId);
    this.setState({ displayTime: Math.floor(time - this.state.startTime) });
  }

  timerLoop = () => {
    this.setState({
      displayTime: Math.floor(performance.now() - this.state.startTime)
    });
    this.animationFrameId = window.requestAnimationFrame(this.timerLoop);
  };

  render() {
    return (
      <TimerDisplay
        scramble={this.state.currentScramble}
        displayTime={this.state.displayTime}
        mode={this.state.mode}
        onDown={this.handleDown}
        onUp={this.handleUp}
      />
    );
  }
}

export default TimerDisplayContainer;
