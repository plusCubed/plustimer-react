import { Component, h } from 'preact';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

import { formatTime, shallowEqual } from '../utils/utils';
import style from './SolvesList.css';
import { ISolve } from './AppWrapper';

export const Penalty = {
  NONE: 0,
  PLUS_TWO: 1,
  DNF: 2
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
      top: Math.min(parent.top+12, maxTop),
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
    <div className={style.dividerItem} key="history-divider">
      <div className={style.dividerItemLine}/>
      <svg className={style.dividerIcon} viewBox="0 0 24 24">
        <path d="M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z" />
      </svg>
      <div className={style.dividerItemLine}/>
    </div>
  );
};

interface IProps {
  //sessions: IRepoSolve[][];
  solves: ISolve[];
  onlyLast: boolean;
  expanded: boolean;
  onPenalty: (solve: ISolve, penalty: number) => void;
  onDelete: (solve: ISolve) => void;
}

const SolvesList = ({ /*sessions, */solves, expanded, onlyLast, onPenalty, onDelete }: IProps) => {
  /*if(onlyLast) {
    sessions = sessions.slice(0,1);
  }*/

  const solveDivs = solves.map((solve) => (
    <SolveItem
      key={solve.id}
      solve={solve}
      onPenalty={onPenalty}
      onDelete={onDelete}
    />
  ));

  return (
    <div className={expanded ? style.solveListExpanded : style.solveList}>
      {/*sessions.map((solves, sessionIndex) => {
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
            return <div className={style.emptyItem} key="empty">Do some solves!</div>
          }
        } else if (sessionIndex===1) {
          return [
            <HistoryDivider/>,
            solveElements
          ]
        }else{
          return [
            <div className={style.divider} key={solves[0].id + '-divider'}>
            </div>,
            solveElements
          ]
        }
      })*/}

      {solveDivs}

    </div>
  );
};

export default SolvesList;
