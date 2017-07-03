import { connect, Dispatch } from 'react-redux';
import Timer, { DispatchProps, StoreStateProps } from '../components/Timer';
import { down, up } from '../reducers/timerMode';
import { StoreState } from '../reducers/index';
import { Action } from '../utils/Util';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    displayTime: state.timer.time.elapsed,
    mode: state.timer.mode
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    onDown: () => {
      dispatch(down(performance.now()));
    },
    onUp: () => {
      dispatch(up(performance.now()));
    }
  };
};

const CurrentTimer = connect(mapStateToProps, mapDispatchToProps)(Timer);

export default CurrentTimer;
