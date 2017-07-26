import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Action, StoreState } from '../reducers/index';
import SolvesSheet, {
  DispatchProps,
  StoreStateProps
} from '../components/SolvesSheet';
import { getNewToOldSolves } from '../reducers/docs';
import { openDialog } from '../reducers/solveDialog';
import { Solve } from '../services/solves-service';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    solves: getNewToOldSolves(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    onCellClicked: (solve: Solve) => {
      dispatch(openDialog(solve));
    }
  };
};

export const CurrentSolvesSheet = connect(mapStateToProps, mapDispatchToProps)(
  SolvesSheet
);
