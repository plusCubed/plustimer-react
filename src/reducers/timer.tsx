// TIMER MODE ACTIONS
import {combineReducers} from 'redux';
import {timerTimeReducer, TimeState} from './timerTime';
import {timerModeReducer} from './timerMode';

// TIMER REDUCER

export interface TimerState {
    mode: string;
    time: TimeState;
}

export const timerReducer = combineReducers({
    mode: timerModeReducer,
    time: timerTimeReducer
});