import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Action, StoreState } from '../reducers/index';
import SolvesGrid, {
  DispatchProps,
  StoreStateProps
} from '../components/SolvesGrid';
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

export const SolvesGridContainer = connect(mapStateToProps, mapDispatchToProps)(
  SolvesGrid
);
