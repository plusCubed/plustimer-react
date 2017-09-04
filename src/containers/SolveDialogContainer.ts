import {
  DispatchProps,
  SolveDialog,
  StoreStateProps
} from '../components/SolveDialog';
import { Action, StoreState } from '../reducers/index';
import { connect, Dispatch } from 'react-redux';
import { closeDialog } from '../reducers/solveDialogReducer';
import { deleteSolve } from '../reducers/docsReducer';
import { Solve } from '../services/solvesService';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    isOpen: state.dialog.isOpen,
    solve: state.dialog.solve
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    onRequestClose: () => {
      dispatch(closeDialog());
    },
    onDeleteClicked: (solve: Solve) => {
      dispatch(deleteSolve(solve));
    }
  };
};

export const SolveDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SolveDialog);
