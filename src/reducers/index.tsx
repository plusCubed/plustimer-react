import { combineReducers } from 'redux';
import { timerReducer, TimerStoreState } from './timer';
import { Solve } from '../services/solves-service';
import { solvesReducer } from './solves';
import { scrambleReducer, ScrambleStoreState } from './scramble';
import { accountReducer, AccountStoreState } from './account';

export interface StoreState {
  timer: TimerStoreState;
  solves: Solve[];
  scramble: ScrambleStoreState;
  account: AccountStoreState;
}

const rootReducer = combineReducers({
  timer: timerReducer,
  solves: solvesReducer,
  scramble: scrambleReducer,
  account: accountReducer
});

export default rootReducer;
