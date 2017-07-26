import {
  DispatchProps,
  Statistics,
  StoreStateProps
} from '../components/Statistics';
import { Action, StoreState } from '../reducers/index';
import { connect, Dispatch } from 'react-redux';
import { getAo12, getAo5, getBestAo12, getBestAo5 } from '../reducers/docs';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    currAo5: getAo5(state),
    currAo12: getAo12(state),
    bestAo5: getBestAo5(state),
    bestAo12: getBestAo12(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {};
};

export const CurrentStatistics = connect(mapStateToProps, mapDispatchToProps)(
  Statistics
);
