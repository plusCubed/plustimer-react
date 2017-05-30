import {Action} from '../utils/Util';

export const TICK_TIMER = 'TIMER/TICK_TIMER';
export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';
export const RESET_TIMER = 'RESET_TIMER';

// TIMER TIME ACTION CREATORS
export const startTimer = (): Action => ({
    type: START_TIMER,
    payload: performance.now()
});

export const stopTimer = (): Action => ({
    type: STOP_TIMER,
    payload: performance.now()
});

export const resetTimer = (): Action => ({
    type: RESET_TIMER
});

export const tickTimer = (): Action => ({
    type: TICK_TIMER
});

// TIMER TIME CONSTANTS
// The new mode & which action it corresponds to
export const transitionTimeMap = {
    'TIMER/DOWN': {
        'handOnTimer': resetTimer,
        'stopped': stopTimer
    },
    'TIMER/UP': {
        'running': startTimer,
        'ready': null
    },
    'TIMER/CANCEL': {
        'ready': resetTimer
    }
};

// TIMER TIME REDUCER
export interface TimeState {
    start: number;
    elapsed: number;
}

const initialTimeState: TimeState = {
    start: 0,
    elapsed: 0
};

export const timerTimeReducer = (state = initialTimeState, action: Action) => {
    switch (action.type) {
        case START_TIMER:
            return {
                ...state,
                start: action.payload,
            };
        case RESET_TIMER:
            return {
                start: 0,
                elapsed: 0
            };
        case TICK_TIMER:
            return {
                ...state,
                elapsed: performance.now() - state.start
            };
        case STOP_TIMER:
            return {
                ...state,
                elapsed: action.payload - state.start
            };
        default:
            return state;
    }
};