import { Config, Doc, Puzzle, Solve } from '../services/solves-service';
import { Action, StoreState } from './index';
import { createSelector } from 'reselect';
import { mean } from '../utils/Util';

export const DB_DOCS_FETCHED = 'SOLVES/DB_DOCS_FETCHED';
export const DB_DOC_ADD_UPDATED = 'SOLVES/DB_DOC_ADD_UPDATED';
export const DB_DOC_DELETED = 'SOLVES/DB_DOC_DELETED';

export const DELETE_SOLVE = 'SOLVES/DELETE_SOLVE';

export const SELECT_PUZZLE = 'SOLVES/SELECT_PUZZLE';
export const PUZZLE_SELECTED = 'SOLVES/PUZZLE_SELECTED';
export const SELECT_CATEGORY = 'SOLVES/SELECT_CATEGORY';
export const CATEGORY_SELECTED = 'SOLVES/CATEGORY_SELECTED';

export const dbDocsFetched = (docs: Doc[]): Action => ({
  type: DB_DOCS_FETCHED,
  payload: docs
});

export const dbDocAddUpdated = (doc: Doc): Action => ({
  type: DB_DOC_ADD_UPDATED,
  payload: doc
});

export const dbDocDeleted = (id: string): Action => ({
  type: DB_DOC_DELETED,
  payload: id
});

export const deleteSolve = (solve: Solve): Action => ({
  type: DELETE_SOLVE,
  payload: solve
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

// SELECTORS

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
    const puzzle = puzzles.find(puzzle => puzzle._id === config.currentPuzzle);
    if (puzzle) return puzzle.categories;
    else return [];
  }
);

export const getCurrentPuzzle = createSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) =>
    puzzles.find(puzzle => puzzle._id === config.currentPuzzle)
);

export const getCurrentPuzzleIndex = createSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) =>
    puzzles.findIndex(puzzle => puzzle._id === config.currentPuzzle)
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
        solve.puzzle === config.currentPuzzle &&
        solve.category === config.currentCategory
    )
);

export const getNewToOldSolves = createSelector(
  getCurrentSolves,
  (solves: Solve[]) => solves.slice().reverse()
);

export const NOT_ENOUGH_SOLVES = -1;

const getAverageFactory = (count: number) =>
  createSelector(getCurrentSolves, (solves: Solve[]) => {
    if (solves.length >= count) {
      let lastNSolves = solves
        .slice()
        .slice(solves.length - count)
        .map(solve => solve.time);
      let min = Math.min(...lastNSolves);
      let max = Math.max(...lastNSolves);
      return mean(lastNSolves.filter(time => time != min && time != max));
    } else {
      return NOT_ENOUGH_SOLVES;
    }
  });

const getBestAverageFactory = (count: number) =>
  createSelector(getCurrentSolves, (solves: Solve[]) => {
    if (solves.length >= count) {
      let bestNSolves = solves
        .slice()
        .sort((a: Solve, b: Solve) => a.time - b.time)
        .slice(0, count)
        .map(solve => solve.time);
      let min = Math.min(...bestNSolves);
      let max = Math.max(...bestNSolves);
      return mean(bestNSolves.filter(time => time != min && time != max));
    } else {
      return NOT_ENOUGH_SOLVES;
    }
  });

export const getAo5 = getAverageFactory(5);
export const getAo12 = getAverageFactory(12);
export const getBestAo5 = getBestAverageFactory(5);
export const getBestAo12 = getBestAverageFactory(12);

const sortDocs = (docs: Doc[]) => {
  return docs.sort((a: Doc, b: Doc) => {
    return a._id.localeCompare(b._id);
  });
};

// REDUCER

export const docsReducer = (state: Doc[] = [], action: Action) => {
  switch (action.type) {
    case DB_DOCS_FETCHED:
      return sortDocs(action.payload);
    case DB_DOC_ADD_UPDATED:
      const exists = state.find(solve => solve._id === action.payload._id);

      if (exists) {
        // UPDATE
        return sortDocs(
          state.map(solve => {
            return solve._id === action.payload._id
              ? { ...solve, ...action.payload }
              : solve;
          })
        );
      } else {
        // ADD
        return sortDocs([...state, action.payload]);
      }
    case DB_DOC_DELETED:
      return state.filter(solve => solve._id !== action.payload);
    default:
      return state;
  }
};
