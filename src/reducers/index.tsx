import {combineReducers} from 'redux';
import {timerReducer, TimerStoreState} from './timer';
import {Solve} from '../services/solves-service';
import {solvesReducer} from './solves';

export interface StoreState {
    timer: TimerStoreState;
    solves: Solve[];
}

const rootReducer = combineReducers({
    timer: timerReducer,
    solves: solvesReducer,
});

export default rootReducer;