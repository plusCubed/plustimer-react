import { connect, Dispatch } from 'react-redux';
import Timer, { DispatchProps, StoreStateProps } from '../components/Timer';
import { down, up } from '../reducers/timerModeReducer';
import { Action, StoreState } from '../reducers/index';

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

export const TimerContainer = connect(mapStateToProps, mapDispatchToProps)(
  Timer
);
