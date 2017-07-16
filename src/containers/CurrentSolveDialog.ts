import {
  DispatchProps,
  SolveDialog,
  StoreStateProps
} from '../components/SolveDialog';
import { Action, StoreState } from '../reducers/index';
import { connect, Dispatch } from 'react-redux';
import { closeDialog } from '../reducers/solveDialog';
import { deleteSolve } from '../reducers/docs';
import { Solve } from '../services/solves-service';

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

const CurrentSolveDialog = connect(mapStateToProps, mapDispatchToProps)(
  SolveDialog
);

export default CurrentSolveDialog;
