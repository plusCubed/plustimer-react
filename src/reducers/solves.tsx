import {Action} from '../utils/Util';
import {Solve} from '../services/solves-service';
import {StoreState} from './index';
import {createSelector} from 'reselect';

export const FETCH_SOLVES = 'SOLVES/FETCH_SOLVES';
export const FETCH_SOLVES_SUCCESS = 'SOLVES/FETCH_SOLVES_SUCCESS';
export const ADD_UPDATE_SOLVE = 'SOLVES/ADD_SOLVE';
export const DELETE_SOLVE = 'SOLVES/DELETE_SOLVE';

export const fetchSolves = (): Action => ({
    type: FETCH_SOLVES
});

export const fetchSolvesSuccess = (solves: Solve[]): Action => ({
    type: FETCH_SOLVES_SUCCESS,
    payload: solves
});

export const addUpdateSolve = (solve: Solve): Action => ({
    type: ADD_UPDATE_SOLVE,
    payload: solve
});

export const deleteSolve = (id: string): Action => ({
    type: DELETE_SOLVE,
    payload: id
});

const getSolves = (state: StoreState) => state.solves;

export const getNewToOldSolves = createSelector(
    getSolves,
    (solves) => solves.slice().reverse()
);

// ACTION CREATORS

export const solvesReducer = (state: Solve[] = [], action: Action) => {
    switch (action.type) {
        case FETCH_SOLVES_SUCCESS:
            return action.payload;
        case ADD_UPDATE_SOLVE:
            const exists = state.find(solve => solve._id === action.payload._id);

            if (exists) {
                // UPDATE
                return state.map(solve => {
                    return solve._id === action.payload._id ?
                        {...solve, ...action.payload} :
                        solve;
                });
            } else {
                // ADD
                return [...state, ...action.payload];
            }
        default:
            return state;
    }
};