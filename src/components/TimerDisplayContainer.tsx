import { h } from 'preact';
import PureComponent from './PureComponent';

import TimerDisplay, { TimerMode } from './TimerDisplay';
import { Penalty } from './SolvesList';

import scrambleService from '../utils/scrambleService';

import { IPuzzle } from './AppWrapper';
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

  public async componentDidUpdate(prevProps) {
    if (
      (this.props.puzzle !== prevProps.puzzle) &&
      this.props.puzzle
    ) {
      console.log('User/puzzle changed, generating scrambles');

      if (!this.scrambling) {
        this.startFetchScramble();
        await this.advanceScramble();
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
        if (!this.scrambling) {
          this.startTimer(now);
          this.startFetchScramble();
        }
        break;
      case TimerMode.Stopped:
        this.stopTimer(now);
        await this.addSolve(now);
        break;
      default:
        break;
    }
  }

  private async addSolve(now) {
    if (!this.props.puzzle) {
      return;
    }

    await SolveRepo.onConnected();

    await (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES)).query('upsert', {
      categoryId: this.props.puzzle.categoryId,
      //TODO:
      sessionId: 0,
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
