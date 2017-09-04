// TIMER MODE ACTIONS
import { combineReducers } from 'redux';
import { timerTimeReducer, TimeStoreState } from './timerTimeReducer';
import { timerModeReducer } from './timerModeReducer';

// TIMER REDUCER

export interface TimerStoreState {
  mode: string;
  time: TimeStoreState;
}

export const timerReducer = combineReducers({
  mode: timerModeReducer,
  time: timerTimeReducer
});
