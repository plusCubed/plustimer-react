import { Action as ReduxAction, combineReducers } from 'redux';
import { timerReducer, TimerStoreState } from './timerReducer';
import { docsReducer, DocsStoreState } from './docsReducer';
import { scrambleReducer, ScrambleStoreState } from './scrambleReducer';
import { accountReducer, AccountStoreState } from './accountReducer';
import { solveDialogReducer, SolveDialogState } from './solveDialogReducer';

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
