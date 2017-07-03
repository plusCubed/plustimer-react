// TIMER MODE ACTIONS
import { combineReducers } from 'redux';
import { timerTimeReducer, TimeStoreState } from './timerTime';
import { timerModeReducer } from './timerMode';

// TIMER REDUCER

export interface TimerStoreState {
  mode: string;
  time: TimeStoreState;
}

export const timerReducer = combineReducers({
  mode: timerModeReducer,
  time: timerTimeReducer
});
