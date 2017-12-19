// @flow

import * as React from 'react';
import { formatTime } from '../utils/utils';

import style from './TimerDisplay.css';

type Props = {
  displayTime: number,
  mode: string,
  onDown: () => void,
  onUp: () => void
};

export const TimerMode = {
  Ready: 'ready',
  HandOnTimer: 'handOnTimer',
  Running: 'running',
  Stopped: 'stopped'
};

class TimerDisplay extends React.PureComponent<Props, void> {
  componentDidMount(): void {
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === ' ' || this.props.mode === TimerMode.Running) {
          e.preventDefault();
          this.props.onDown();
        }
      },
      { passive: false }
    );
    window.addEventListener(
      'keyup',
      (e: KeyboardEvent) => {
        if (e.key === ' ' || this.props.mode === TimerMode.Stopped) {
          e.preventDefault();
          this.props.onUp();
        }
      },
      { passive: false }
    );
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown');
    window.removeEventListener('keyup');
  }

  render() {
    const { onDown, onUp, displayTime, mode } = this.props;

    return (
      <div
        className={`${style.timer} ${style[mode]}`}
        onTouchStart={onDown}
        onTouchEnd={onUp}
      >
        {formatTime(displayTime)}
      </div>
    );
  }
}

export default TimerDisplay;
