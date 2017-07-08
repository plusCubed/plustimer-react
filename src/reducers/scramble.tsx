import { Action } from './index';

export const FETCH_SCRAMBLE_START = 'SCRAMBLE/FETCH_SCRAMBLE_START';
export const FETCH_SCRAMBLE_SUCCESS = 'SCRAMBLE/FETCH_SCRAMBLE_SUCCESS';
export const ADVANCE_SCRAMBLE = 'SCRAMBLE/ADVANCE_SCRAMBLE';

export const fetchScrambleStart = (): Action => ({
  type: FETCH_SCRAMBLE_START
});

export const fetchScrambleSuccess = (scramble: string): Action => ({
  type: FETCH_SCRAMBLE_SUCCESS,
  payload: scramble
});

export const advanceScramble = (): Action => ({
  type: ADVANCE_SCRAMBLE
});

export interface ScrambleStoreState {
  currentScramble: string;
  nextScramble: string;
  scrambling: boolean;
}

const initialStoreState: ScrambleStoreState = {
  currentScramble: '',
  nextScramble: '',
  scrambling: false
};

export const scrambleReducer = (state = initialStoreState, action: Action) => {
  switch (action.type) {
    case ADVANCE_SCRAMBLE:
      return {
        ...state,
        currentScramble: state.nextScramble,
        nextScramble: ''
      };
    case FETCH_SCRAMBLE_START:
      return {
        ...state,
        scrambling: true
      };
    case FETCH_SCRAMBLE_SUCCESS:
      return {
        ...state,
        nextScramble: action.payload,
        scrambling: false
      };
    default:
      return state;
  }
};
