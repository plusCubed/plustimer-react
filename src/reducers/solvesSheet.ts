import {Action} from '../utils/Util';

export interface SolvesSheetState {
    lastY: number;
    lastDy: number;
    isSecondTouch: boolean;

    expanded: boolean;

    isAnimating: boolean;
    scrollState: ScrollState;
}

enum ScrollState {
    IDLE, PANNING, SCROLLING
}

export const TOUCH_MOVE = 'SOLVES_SHEET/TOUCH_MOVE';
export const TOUCH_END = 'SOLVES_SHEET/TOUCH_DOWN';

// ACTION CREATORS
export const touchMove = (e: React.TouchEvent<HTMLElement>): Action => ({
    type: TOUCH_MOVE,
    payload: e
});

export const touchEnd = (e: React.TouchEvent<HTMLElement>): Action => ({
    type: TOUCH_END,
    payload: e
});

const initialState: SolvesSheetState = {
    lastY: -1,
    lastDy: 0,
    isSecondTouch: false,

    expanded: false,

    isAnimating: false,
    scrollState: ScrollState.IDLE,
};

export const solvesSheetReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case TOUCH_MOVE:

            const e: React.TouchEvent<HTMLElement> = action.payload;

            if (state.isAnimating) {
                return;
            }

            let touchobj = e.changedTouches[0];
            const dY = touchobj.clientY - state.lastY;

            /*if (state.lastY === -1) {
                // Initial touch event: ignore, set flag
                state.isSecondTouch = true;
            } else if (state.isSecondTouch) {
                // Second touch event: determine direction, whether to move the sheet

                if (state.scrollState !== ScrollState.SCROLLING && !state.expanded ||
                    this.scrollContent.scrollTop == 0 && dY > 0) {
                    this.setScrollEnabled(false);
                    this.state = ScrollState.PANNING;
                    this.offset = 0;
                }

                this.isSecondTouch = false;

            } else {
                // Later touch events: move the sheet

                if (this.state == ScrollState.PANNING) {
                    this.setScrollEnabled(false);
                    this.offset = this.offset + dY;
                }

                this.lastDy = dY;
            }


            this.lastY = touchobj.clientY;*/
            return state;
        case TOUCH_END:
        default:
            return state;
    }
};