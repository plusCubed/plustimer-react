import { h } from 'preact';
import PureComponent from './PureComponent';
import { formatTime } from '../utils/utils';
import Media from 'react-media';

import Statistics from './Statistics';

import style from './TimerDisplay.css';

type Props = {
  displayTime: number;
  mode: string;
  onDown: () => void;
  onUp: () => void;
  scramble: string;
};

export const TimerMode = {
  Ready: 'ready',
  HandOnTimer: 'handOnTimer',
  Running: 'running',
  Stopped: 'stopped'
};

class TimerDisplay extends PureComponent<Props, {}> {
  private keydownListener: (e: KeyboardEvent) => void;

  private keyupListener: (e: KeyboardEvent) => void;

  componentDidMount(): void {
    this.keydownListener = (e: KeyboardEvent) => {
      if (e.key === ' ' || this.props.mode === TimerMode.Running) {
        e.preventDefault();
        this.props.onDown();
      }
    };

    window.addEventListener(
      'keydown',
      this.keydownListener,
      { passive: false }
    );

    this.keyupListener = (e: KeyboardEvent) => {
      if (e.key === ' ' || this.props.mode === TimerMode.Stopped) {
        e.preventDefault();
        this.props.onUp();
      }
    };
    window.addEventListener(
      'keyup',
      this.keyupListener,
      { passive: false }
    );
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.keydownListener);
    window.removeEventListener('keyup', this.keyupListener);
  }

  render() {
    const { onDown, onUp, displayTime, mode, scramble } = this.props;

    return (
      <div className={style.timer} onTouchStart={onDown} onTouchEnd={onUp}>
        <div className={style.scramble}>
          {scramble || 'Generating scramble...'}
        </div>
        <div className={`${style.timerText} ${style[mode]}`}>
          {formatTime(displayTime)}
        </div>
       {/* <Media query="(max-width: 840px)" render={() => <Statistics />} />*/}
      </div>
    );
  }
}

export default TimerDisplay;
