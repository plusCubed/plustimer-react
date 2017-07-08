import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Action, StoreState } from '../reducers/index';
import SolvesSheet, {
  DispatchProps,
  StoreStateProps
} from '../components/SolvesSheet';
import { getNewToOldSolves } from '../reducers/solves';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    solves: getNewToOldSolves(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {};
};

const CurrentSolvesSheet = connect(mapStateToProps, mapDispatchToProps)(
  SolvesSheet
);

export default CurrentSolvesSheet;
