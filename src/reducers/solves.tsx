import { Config, Doc, Puzzle, Solve } from '../services/solves-service';
import { Action, StoreState } from './index';
import { createSelector } from 'reselect';

export const FETCH_DOCS_SUCCESS = 'SOLVES/FETCH_SOLVES_SUCCESS';
export const ADD_UPDATE_DOC = 'SOLVES/ADD_UPDATE_SOLVE';
export const DELETE_DOC = 'SOLVES/DELETE_SOLVE';
export const SELECT_PUZZLE = 'SOLVES/SELECT_PUZZLE';
export const PUZZLE_SELECTED = 'SOLVES/PUZZLE_SELECTED';
export const SELECT_CATEGORY = 'SOLVES/SELECT_CATEGORY';
export const CATEGORY_SELECTED = 'SOLVES/CATEGORY_SELECTED';

export const fetchDocsSuccess = (docs: Doc[]): Action => ({
  type: FETCH_DOCS_SUCCESS,
  payload: docs
});

export const addUpdateDoc = (doc: Doc): Action => ({
  type: ADD_UPDATE_DOC,
  payload: doc
});

export const deleteDoc = (id: string): Action => ({
  type: DELETE_DOC,
  payload: id
});

export const selectPuzzle = (index: number): Action => ({
  type: SELECT_PUZZLE,
  payload: index
});

export const selectCategory = (index: number): Action => ({
  type: SELECT_CATEGORY,
  payload: index
});

export const puzzleSelected = (puzzle: Puzzle): Action => ({
  type: PUZZLE_SELECTED,
  payload: puzzle
});

export const categorySelected = (): Action => ({
  type: CATEGORY_SELECTED
});

const getDocs = (state: StoreState) => state.docs;

export const getConfig = createSelector(
  getDocs,
  docs => docs.find(doc => doc._id === 'config') as Config
);

export const getPuzzles = createSelector(
  getDocs,
  docs => docs.filter(doc => doc._id.startsWith('puzzle')) as Puzzle[]
);

export const getPuzzleNames = createSelector(getPuzzles, puzzles =>
  puzzles.map(puzzle => puzzle.name)
);

export const getCategories = createSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) => {
    const puzzle = puzzles.find(
      puzzle => puzzle._id === config.currentPuzzleId
    );
    if (puzzle) return puzzle.categories;
    else return [];
  }
);

export const getCurrentPuzzle = createSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) =>
    puzzles.find(puzzle => puzzle._id === config.currentPuzzleId)
);

export const getCurrentPuzzleIndex = createSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) =>
    puzzles.findIndex(puzzle => puzzle._id === config.currentPuzzleId)
);

export const getCurrentCategoryIndex = createSelector(
  [getCategories, getConfig],
  (categories: string[], config: Config) =>
    categories.findIndex(category => category === config.currentCategory)
);

const getSolves = createSelector(
  getDocs,
  docs => docs.filter(doc => doc._id.startsWith('solve')) as Solve[]
);

export const getCurrentSolves = createSelector(
  [getSolves, getConfig],
  (solves, config) =>
    solves.filter(
      solve =>
        solve.puzzleId === config.currentPuzzleId &&
        solve.category === config.currentCategory
    )
);

export const getNewToOldSolves = createSelector(getCurrentSolves, solves =>
  //TODO: Use binary search instead of sorting every time
  solves
    .sort((a: Solve, b: Solve) => {
      return a._id.localeCompare(b._id);
    })
    .slice()
    .reverse()
);

// ACTION CREATORS

export const solvesReducer = (state: Doc[] = [], action: Action) => {
  switch (action.type) {
    case FETCH_DOCS_SUCCESS:
      return action.payload;
    case ADD_UPDATE_DOC:
      const exists = state.find(solve => solve._id === action.payload._id);

      if (exists) {
        // UPDATE
        return state.map(solve => {
          return solve._id === action.payload._id
            ? { ...solve, ...action.payload }
            : solve;
        });
      } else {
        // ADD
        return [...state, action.payload];
      }
    case DELETE_DOC:
      return state.filter(solve => solve._id !== action.payload);
    default:
      return state;
  }
};
