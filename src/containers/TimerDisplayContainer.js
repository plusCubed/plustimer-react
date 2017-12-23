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

type Props = {
  uid: string
};

type State = {
  startTime: number,
  displayTime: number,
  mode: string
};

class TimerDisplayContainer extends React.PureComponent<Props, State> {
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

    const time = Math.trunc(performance.now());
    this.setState({ mode: newMode });

    switch (newMode) {
      case TimerMode.HandOnTimer:
        this.resetTimer();
        break;
      case TimerMode.Running:
        this.startTimer(time);
        break;
      case TimerMode.Stopped:
        {
          this.stopTimer(time);

          if (this.props.uid) {
            const firestore = await firebase.firestore();
            const ref = firestore
              .collection('users')
              .doc(this.props.uid)
              .collection('puzzles')
              .doc('333')
              .collection('categories')
              .doc('normal')
              .collection('solves');

            const docRef = await ref.add({
              time: Math.floor(time - this.state.startTime),
              timestamp: new Date(),
              scramble: '',
              penalty: Penalty.NORMAL
            });
            console.log('Document written with ID: ', docRef.id);
          }
        }
        break;
      default:
        break;
    }
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
        displayTime={this.state.displayTime}
        mode={this.state.mode}
        onDown={this.handleDown}
        onUp={this.handleUp}
      />
    );
  }
}

export default TimerDisplayContainer;
