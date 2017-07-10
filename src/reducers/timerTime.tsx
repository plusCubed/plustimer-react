import { Action } from './index';

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
  stoppedTimestamp?: Date;
}

const initialTimeState: TimeStoreState = {
  start: 0,
  elapsed: 0,
  stoppedTimestamp: undefined
};

export const timerTimeReducer = (
  state = initialTimeState,
  action: Action
): TimeStoreState => {
  switch (action.type) {
    case START_TIMER:
      return {
        ...state,
        start: action.payload
      };
    case RESET_TIMER:
      return {
        start: 0,
        elapsed: 0,
        stoppedTimestamp: undefined
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
        stoppedTimestamp: new Date()
      };
    default:
      return state;
  }
};
