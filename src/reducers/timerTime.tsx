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
    running: boolean;
    start: number;
    elapsed: number;
    stoppedTimestamp: number;
}

const initialTimeState: TimeStoreState = {
    running: false,
    start: 0,
    elapsed: 0,
    stoppedTimestamp: 0
};

export const timerTimeReducer = (state = initialTimeState, action: Action) => {
    switch (action.type) {
        case START_TIMER:
            if (!state.running) {
                return {
                    ...state,
                    running: true,
                    start: action.payload,
                };
            } else {
                return state;
            }
        case RESET_TIMER:
            return {
                running: false,
                start: 0,
                elapsed: 0
            };
        case TICK_TIMER:
            return {
                ...state,
                elapsed: action.payload - state.start
            };
        case STOP_TIMER:
            if (state.running) {
                return {
                    ...state,
                    running: false,
                    elapsed: action.payload - state.start,
                    stoppedTimestamp: action.payload
                };
            } else {
                return state;
            }
        default:
            return state;
    }
};