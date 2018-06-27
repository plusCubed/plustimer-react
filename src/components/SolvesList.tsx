import { Component, h } from 'preact';
import PureComponent from './PureComponent';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

import { formatTime, shallowEqual } from '../utils/utils';
import style from './SolvesList.css';

export const Penalty = {
  NONE: 0,
  PLUS_TWO: 1,
  DNF: 2
};

export interface ISolve {
  // Firebase key
  id: string;
  time: number;
  // Unix timestamp in ms
  timestamp: number;
  scramble: string;
  penalty: number;
}

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

interface SolvePopupProps {
  solve: ISolve,
  onPenalty: (Solve, number) => void,
  onDelete: (ISolve) => void,
  onDismiss: () => void,
  parent: ClientRect
}

interface SolvePopupState {
  height: number
}

class SolvePopup extends Component<SolvePopupProps, SolvePopupState> {
  public state = {
    height: 0
  };

  public componentDidMount() {
    this.setState({
      height: this.base.getBoundingClientRect().height
    });
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return !(
      shallowEqual(this.props.solve, nextProps.solve) &&
      shallowEqual(this.state, nextState)
    );
  }

  public render() {
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

interface SolveItemProps {
  solve: ISolve,
  onPenalty: (solve: ISolve, penalty: number) => void,
  onDelete: (solve: ISolve) => void
}

interface SolveItemState {
  popupOpen: boolean,
  popupLock: boolean
}

class SolveItem extends Component<SolveItemProps, SolveItemState> {
  public state = {
    popupOpen: false,
    popupLock: false
  };

  public handleHover = () => {
    this.setState({ popupOpen: true });
  };

  public handleHoverExit = () => {
    this.setState({ popupOpen: false });
  };

  public handleClick = () => {
    if (!this.state.popupOpen) { this.setState({ popupLock: true }); }
  };

  public handleDismiss = () => {
    this.setState({ popupOpen: false, popupLock: false });
  };

  public shouldComponentUpdate(nextProps, nextState) {
    return !(
      shallowEqual(this.props.solve, nextProps.solve) &&
      shallowEqual(this.state, nextState)
    );
  }

  public render() {
    const { solve, onPenalty, onDelete } = this.props;
    const popupOpen = this.state.popupOpen || this.state.popupLock;
    return (
      <div
        className={style.solveItem}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHoverExit}
      >
        <div
          className={`${style.solveListItem} ${
            popupOpen ? style.popupOpen : ''
          }`}
          onClick={this.handleClick}
        >
          <div className={style.solveListItemText}>
            {buildSolveTimeString(solve)}
          </div>
        </div>
        {popupOpen ? (
          <SolvePopup
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

const HistoryDivider = () => {
  return (
    <div className={style.divider}>
    </div>
  );
};

interface IProps {
  sessions: ISolve[][];
  expanded: boolean;
  onPenalty: (solve: ISolve, penalty: number) => void;
  onDelete: (solve: ISolve) => void;
}

const SolvesList = ({ sessions, expanded, onPenalty, onDelete }: IProps) => {
  return (
    <div className={style.solveList + (expanded ? ' ' + style.expanded : '')}>
      {sessions.map((solves, sessionIndex) => {
        const solveElements = solves.map((solve, index) =>
          <SolveItem
            key={solve.id}
            solve={solve}
            onPenalty={onPenalty}
            onDelete={onDelete}
          />);

        if(sessionIndex===0){
          if(solveElements.length>0) {
            return solveElements;
          }else{
            return <div>Do some solves!</div>
          }
        }else{
          return [
            <div className={style.divider}>
            </div>,
            solveElements
          ]
        }
      })}
    </div>
  );
};

export default SolvesList;
