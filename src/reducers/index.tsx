import {combineReducers} from 'redux';
import {timerReducer, TimerStoreState} from './timer';
import {solvesSheetReducer, SolvesSheetStoreState} from './solvesSheet';

export interface StoreState {
    timer: TimerStoreState;
    solvesSheet: SolvesSheetStoreState;
}

const rootReducer = combineReducers({
    timer: timerReducer,
    solvesSheet: solvesSheetReducer,
});

export default rootReducer;