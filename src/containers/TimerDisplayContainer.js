// @flow

import * as React from 'react';

import TimerDisplay, { TimerMode } from '../components/TimerDisplay';
import firebase from '../utils/firebase';

import { Penalty } from '../components/SolvesList';

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

type State = {
  startTime: number,
  displayTime: number,
  mode: string
};

class TimerDisplayContainer extends React.PureComponent<void, State> {
  state = {
    startTime: -1,
    displayTime: 0,
    mode: TimerMode.Ready
  };

  animationFrameId = 0;

  componentDidMount() {}

  componentWillUnmount() {
    this.stopTimer();
  }

  handleDown = () => {
    const currentMode = this.state.mode;
    const newMode = transitionMode(TimerModeAction.Down, currentMode);
    this.transitionNewMode(currentMode, newMode);
  };

  handleUp = () => {
    const currentMode = this.state.mode;
    const newMode = transitionMode(TimerModeAction.Up, currentMode);
    this.transitionNewMode(currentMode, newMode);
  };

  transitionNewMode(oldMode, newMode) {
    if (oldMode === newMode) {
      return;
    }

    switch (newMode) {
      case TimerMode.Running:
        this.startTimer();
        break;
      case TimerMode.Stopped:
        const firestore = firebase.firestore();
        const ref = firestore
          .collection('users')
          .doc('user1')
          .collection('puzzles')
          .doc('333')
          .collection('categories')
          .doc('normal')
          .collection('solves');
        ref
          .add({
            time: Math.trunc(performance.now() - this.state.startTime),
            timestamp: new Date(),
            scramble: '',
            penalty: Penalty.NORMAL
          })
          .then(docRef => {
            console.log('Document written with ID: ', docRef.id);
          });
        this.stopTimer();
        break;
      default:
        break;
    }

    this.setState({ mode: newMode });
  }

  startTimer() {
    this.setState({ startTime: Math.trunc(performance.now()) });
    this.animationFrameId = window.requestAnimationFrame(this.timerLoop);
  }

  stopTimer() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  timerLoop = () => {
    this.setState({
      displayTime: Math.trunc(performance.now() - this.state.startTime)
    });
    this.animationFrameId = window.requestAnimationFrame(this.timerLoop);
  };

  render() {
    return (
      <TimerDisplay
        displayTime={this.state.displayTime}
        mode={this.state.mode}
        onDown={this.handleDown}
        onUp={this.handleUp}
      />
    );
  }
}

export default TimerDisplayContainer;
