// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';

import style from './SolvesList.css';
import { formatTime } from '../utils/utils';

export const Penalty = {
  NONE: 0,
  PLUS_TWO: 1,
  DNF: 2
};

export type Solve = {
  // Firebase key
  id: string,
  time: number,
  // Unix timestamp in ms
  timestamp: number,
  scramble: string,
  penalty: number
};

type Props = {
  solves: Solve[]
};

const buildSolveTimeString = solve => {
  switch (solve.penalty) {
    case Penalty.DNF:
      return 'DNF';
    case Penalty.PLUS_TWO:
      return `${formatTime(solve.time + 2000)}+`;
    case Penalty.NONE:
    default:
      return formatTime(solve.time);
  }
};

class SolveModifier extends React.PureComponent {
  state = {
    height: 0
  };

  componentDidMount() {
    this.setState({
      height: this.base.getBoundingClientRect().height
    });
  }

  render() {
    const { parent, solve, onPenalty, onDelete, onDismiss } = this.props;
    const maxTop =
      typeof window !== 'undefined'
        ? window.innerHeight - this.state.height
        : Number.MAX_VALUE;
    const position = {
      top: Math.min(parent.top, maxTop),
      left: parent.right
    };
    const dateTime = new Date(solve.timestamp);
    return (
      <div className={style.solvePopup} style={position}>
        <div className={style.solvePopupTime}>
          {buildSolveTimeString(solve)}
        </div>
        <div className={style.solvePopupTimestamp}>
          {dateTime.toLocaleDateString() + '\n' + dateTime.toLocaleTimeString()}
        </div>
        <div className={style.solvePopupScramble}>{solve.scramble}</div>
        <div className={style.solvePopupPenalty}>
          <Button
            className={`${style.penaltyButton} ${style.penaltyButtonNone}`}
            onClick={onPenalty(solve, Penalty.NONE)}
          >
            OK
          </Button>
          <Button
            className={`${style.penaltyButton} ${style.penaltyButtonTwo}`}
            onClick={onPenalty(solve, Penalty.PLUS_TWO)}
          >
            +2
          </Button>
          <Button
            className={`${style.penaltyButton} ${style.penaltyButtonDnf}`}
            onClick={onPenalty(solve, Penalty.DNF)}
          >
            DNF
          </Button>
        </div>
        <div className={style.solvePopupActions}>
          <Button onClick={onDelete(solve)}>Delete</Button>
          <Button onClick={onDismiss}>Done</Button>
        </div>
      </div>
    );
  }
}

class SolveItem extends React.PureComponent {
  state = {
    popupOpen: false,
    popupLock: false
  };

  handleHover = () => {
    this.setState({ popupOpen: true });
  };

  handleHoverExit = () => {
    this.setState({ popupOpen: false });
  };

  handleClick = () => {
    if (!this.state.popupOpen) this.setState({ popupLock: true });
  };

  handleDismiss = () => {
    this.setState({ popupOpen: false, popupLock: false });
  };

  render() {
    const { solve, onPenalty, onDelete } = this.props;
    const popupOpen = this.state.popupOpen || this.state.popupLock;
    return (
      <div
        className={style.solveItem}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHoverExit}
      >
        <div
          className={
            style.solveListItem + ' ' + (popupOpen ? style.popupOpen : '')
          }
          onClick={this.handleClick}
        >
          <div className={style.solveListItemText}>
            {buildSolveTimeString(solve)}
          </div>
        </div>
        {popupOpen ? (
          <SolveModifier
            parent={this.base.getBoundingClientRect()}
            solve={solve}
            onPenalty={onPenalty}
            onDelete={onDelete}
            onDismiss={this.handleDismiss}
          />
        ) : null}
      </div>
    );
  }
}

const SolvesList = ({ solves, onPenalty, onDelete }: Props) => {
  return (
    <div className={style.solveList}>
      {solves.map(solve => (
        <SolveItem
          key={solve.id}
          solve={solve}
          onPenalty={onPenalty}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SolvesList;
