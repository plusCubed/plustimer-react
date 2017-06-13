import {combineReducers} from 'redux';
import {timerReducer, TimerStoreState} from './timer';
import {Solve} from '../services/solves-service';
import {solvesReducer} from './solves';
import {scrambleReducer, ScrambleStoreState} from './scramble';

export interface StoreState {
    timer: TimerStoreState;
    solves: Solve[];
    scramble: ScrambleStoreState;
}

const rootReducer = combineReducers({
    timer: timerReducer,
    solves: solvesReducer,
    scramble: scrambleReducer
});

export default rootReducer;