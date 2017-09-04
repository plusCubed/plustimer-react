import { Solve } from '../services/solvesService';
import { Action } from './index';

export const OPEN_DIALOG = 'SOLVE_DIALOG/OPEN_DIALOG';
export const CLOSE_DIALOG = 'SOLVE_DIALOG/CLOSE_DIALOG';

export const openDialog = (solve: Solve): Action => ({
  type: OPEN_DIALOG,
  payload: solve
});

export const closeDialog = (): Action => ({
  type: CLOSE_DIALOG
});

export interface SolveDialogState {
  isOpen: boolean;
  solve?: Solve;
}

const initialStoreState: SolveDialogState = {
  isOpen: false,
  solve: undefined
};

export const solveDialogReducer = (
  state = initialStoreState,
  action: Action
): SolveDialogState => {
  switch (action.type) {
    case OPEN_DIALOG:
      return {
        isOpen: true,
        solve: action.payload
      };
    case CLOSE_DIALOG:
      return {
        ...state,
        isOpen: false
      };
    default:
      return state;
  }
};
