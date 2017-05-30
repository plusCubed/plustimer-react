import {Action} from '../utils/Util';

export const UP = 'TIMER/UP';
export const DOWN = 'TIMER/DOWN';
export const CANCEL = 'TIMER/CANCEL';

// TIMER MODE ACTION CREATORS
export const up = (key?: string): Action => ({
    type: UP,
    payload: key
});

export const down = (key?: string): Action => ({
    type: DOWN,
    payload: key
});

export const cancel = (): Action => ({
    type: CANCEL
});

// TIMER MODE CONSTANTS
export const TimerMode = {
    Ready: 'ready',
    HandOnTimer: 'handOnTimer',
    Running: 'running',
    Stopped: 'stopped'
};

// TIMER TRANSITIONS
// The previous mode & which new mode it corresponds to
export const transitionModeMap = {
    'TIMER/DOWN': {
        'ready': 'handOnTimer',
        'running': 'stopped'
    },
    'TIMER/UP': {
        'handOnTimer': 'running',
        'stopped': 'ready'
    },
    'TIMER/CANCEL': {
        'handOnTimer': 'ready',
        'running': 'ready',
        'stopped': 'ready'
    }
};

// TIMER MODE REDUCER
function transitionMode(actionType: string, timerMode: string): string {
    if (timerMode in transitionModeMap[actionType]) {
        const newMode = transitionModeMap[actionType][timerMode];
        if (!!newMode) {
            return newMode;
        }
    }

    return timerMode;
}

export const timerModeReducer = (state = TimerMode.Ready, action: Action) => {
    switch (action.type) {
        case UP:
            if (action.payload && action.payload !== ' ' && state !== TimerMode.Stopped) {
                return state;
            }
        case DOWN:
            if (action.payload && action.payload !== ' ' && state !== TimerMode.Ready) {
                return state;
            }
        case CANCEL:
            return transitionMode(action.type, state);
        default:
            return state;
    }
};
