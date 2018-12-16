import { h } from 'preact';
import PureComponent from './PureComponent';

import TimerDisplay, { TimerMode } from './TimerDisplay';
import { Penalty } from './SolvesList';

import scrambleService from '../utils/scrambleService';

import { IPuzzle, ISolve } from './AppWrapper';
import { SolveRepo } from '../utils/solveRepo';

export const TimerModeAction = {
  Cancel: 'cancel',
  Down: 'down',
  Up: 'up'
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

interface Props {
  puzzle: IPuzzle;
}

interface State {
  startTime: number;
  displayTime: number;
  mode: string;
  currentScramble: string;
}

class TimerDisplayContainer extends PureComponent<Props, State> {
  public state = {
    startTime: -1,
    displayTime: 0,
    mode: TimerMode.Ready,
    currentScramble: ''
  };

  private nextScramble = '';
  private scrambling: Promise<any> = null;

  private animationFrameId = 0;
  private sessionId = -1;

  public async componentDidUpdate(prevProps) {
    if (
      (this.props.puzzle !== prevProps.puzzle) &&
      this.props.puzzle
    ) {
      console.log('User/puzzle changed, generating scrambles');

      if (!this.scrambling) {
        this.startFetchScramble();
        this.advanceScramble().then();
      }


    }
  }

  public componentWillUnmount() {
    this.stopTimer();
  }

  private handleDown = async () => {
    const currentMode = this.state.mode;
    const newMode = transitionMode(TimerModeAction.Down, currentMode);
    await this.transitionNewMode(currentMode, newMode);
  };

  private handleUp = async () => {
    const currentMode = this.state.mode;
    const newMode = transitionMode(TimerModeAction.Up, currentMode);
    await this.transitionNewMode(currentMode, newMode);
  };

  private async transitionNewMode(oldMode, newMode) {
    if (oldMode === newMode) {
      return;
    }

    const now = Math.trunc(performance.now());

    switch (newMode) {
      case TimerMode.Ready:
        if (oldMode === TimerMode.Stopped) {
          this.advanceScramble().then();
        }
        break;
      case TimerMode.HandOnTimer:
        this.resetTimer();
        break;
      case TimerMode.Running:
        if (this.scrambling) {
          // Current scrambling: cancel transition to running, reset to ready
          this.setState({ mode: TimerMode.Ready });
          return;
        }
        this.startTimer(now);
        this.startFetchScramble();
        break;
      case TimerMode.Stopped:
        this.stopTimer(now);
        this.addSolve(now).then();
        break;
      default:
        break;
    }

    this.setState({ mode: newMode });
  }

  private async addSolve(now) {
    if (!this.props.puzzle || !this.sessionId) {
      return;
    }

    await SolveRepo.onConnected();

    await (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES)).query('upsert', {
      categoryId: this.props.puzzle.categoryId,
      sessionId: this.sessionId,
      penalty: Penalty.NONE,
      scramble: this.state.currentScramble,
      time: Math.floor(now - this.state.startTime),
      timestamp: Date.now()
    }).exec();
  }

  private startFetchScramble() {
    this.scrambling = this.fetchScramble();
  }

  private async fetchScramble() {
    if (!this.props.puzzle) {
      return;
    }

    console.log('Fetching scramble');

    const scramble = await scrambleService.getScramble(this.props.puzzle.scrambler);

    console.log('Fetch scramble complete', scramble);
    this.nextScramble = scramble;
    this.scrambling = null;
  }

  private async advanceScramble() {
    if (this.scrambling) {
      this.setState({
        currentScramble: ''
      });
      await this.scrambling;
    }
    this.setState({
      currentScramble: this.nextScramble
    });
    console.log('Scramble advanced');
  }

  private resetTimer() {
    this.setState({ displayTime: 0 });
  }

  private startTimer(time) {
    this.setState({ startTime: time, displayTime: 0 });
    this.animationFrameId = window.requestAnimationFrame(this.timerLoop);
  }

  private stopTimer(time?) {
    window.cancelAnimationFrame(this.animationFrameId);
    if(time)
      this.setState({ displayTime: Math.floor(time - this.state.startTime) });
  }

  private timerLoop = () => {
    this.setState({
      displayTime: Math.floor(performance.now() - this.state.startTime)
    });
    this.animationFrameId = window.requestAnimationFrame(this.timerLoop);
  };

  public render() {
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
