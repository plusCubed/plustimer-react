import {combineReducers} from 'redux';
import {timerReducer, TimerState} from './timer';

export interface StoreState {
    timer: TimerState;
}

const rootReducer = combineReducers({
    timer: timerReducer,
});

export default rootReducer;