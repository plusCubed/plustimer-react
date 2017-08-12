import { Action as ReduxAction, combineReducers } from 'redux';
import { timerReducer, TimerStoreState } from './timer';
import { docsReducer, DocsStoreState } from './docs';
import { scrambleReducer, ScrambleStoreState } from './scramble';
import { accountReducer, AccountStoreState } from './account';
import { solveDialogReducer, SolveDialogState } from './solveDialog';

export interface Action extends ReduxAction {
  type: string;
  payload?: any;
  error?: boolean;
}

export interface StoreState {
  timer: TimerStoreState;
  docs: DocsStoreState;
  scramble: ScrambleStoreState;
  account: AccountStoreState;
  dialog: SolveDialogState;
}

const rootReducer = combineReducers({
  timer: timerReducer,
  docs: docsReducer,
  scramble: scrambleReducer,
  account: accountReducer,
  dialog: solveDialogReducer
});

export default rootReducer;
