import {Action} from '../utils/Util';

export const TICK_TIMER = 'TIMER/TICK_TIMER';
export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';
export const RESET_TIMER = 'RESET_TIMER';

// TIMER TIME ACTION CREATORS
export const startTimer = (timestamp: number): Action => ({
    type: START_TIMER,
    payload: timestamp
});

export const stopTimer = (timestamp: number): Action => ({
    type: STOP_TIMER,
    payload: timestamp
});

export const resetTimer = (): Action => ({
    type: RESET_TIMER
});

export const tickTimer = (timestamp: number): Action => ({
    type: TICK_TIMER,
    payload: timestamp
});

// TIMER TIME REDUCER
export interface TimeStoreState {
    start: number;
    elapsed: number;
    stoppedTimestamp: number;
}

const initialTimeState: TimeStoreState = {
    start: 0,
    elapsed: 0,
    stoppedTimestamp: 0
};

export const timerTimeReducer = (state = initialTimeState, action: Action): TimeStoreState => {
    switch (action.type) {
        case START_TIMER:
            return {
                ...state,
                start: action.payload,
            };
        case RESET_TIMER:
            return {
                start: 0,
                elapsed: 0,
                stoppedTimestamp: 0
            };
        case TICK_TIMER:
            return {
                ...state,
                elapsed: action.payload - state.start
            };
        case STOP_TIMER:
            return {
                ...state,
                elapsed: Math.trunc(action.payload - state.start),
                stoppedTimestamp: Math.trunc(Date.now() / 1000)
            };
        default:
            return state;
    }
};