import {Action} from '../utils/Util';

export interface SolvesSheetStoreState {

}

export const TOUCH_MOVE = 'SOLVES_SHEET/TOUCH_MOVE';
export const TOUCH_END = 'SOLVES_SHEET/TOUCH_DOWN';
export const SCROLLED_TO_TOP = 'SOLVES_SHEET/SCROLLED_TO_TOP';

// ACTION CREATORS

const initialStoreState: SolvesSheetStoreState = {};

export const solvesSheetReducer = (state = initialStoreState, action: Action) => {
    switch (action.type) {
        case TOUCH_MOVE:


            return state;
        case TOUCH_END:
        default:
            return state;
    }
};