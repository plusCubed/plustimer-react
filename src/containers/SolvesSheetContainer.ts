import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Action, StoreState } from '../reducers/index';
import SolvesSheet, {
  DispatchProps,
  StoreStateProps
} from '../components/SolvesSheet';
import { getCurrentPuzzleSolves } from '../reducers/docsReducer';
import { openDialog } from '../reducers/solveDialogReducer';
import { Solve } from '../services/solvesService';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    solves: getCurrentPuzzleSolves(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    onCellClicked: (solve: Solve) => {
      dispatch(openDialog(solve));
    }
  };
};

export const SolvesSheetContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SolvesSheet);
