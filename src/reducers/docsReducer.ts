import { Config, Doc, Puzzle, Solve } from '../services/solvesService';
import { Action, StoreState } from './index';
import {
  createSelector,
  createSelectorCreator,
  defaultMemoize
} from 'reselect';
import { mean } from '../utils/util';
import { combineReducers } from 'redux';
import { parse } from 'date-fns';

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

const createArrayEqualSelector = createSelectorCreator(
  defaultMemoize,
  (obj1: any, obj2: any) => {
    if (!(obj1 instanceof Array && obj2 instanceof Array)) {
      return obj1 === obj2;
    } else {
      return (
        obj1.length == obj2.length &&
        obj1.every((element, index) => {
          return element === obj2[index];
        })
      );
    }
  }
);

export const getConfig = (state: StoreState) => state.docs.config;

export const getPuzzles = (state: StoreState) => state.docs.puzzles;

export const getPuzzleNames = createArrayEqualSelector(getPuzzles, puzzles =>
  puzzles.map(puzzle => puzzle.name)
);

export const getCategories = createArrayEqualSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) => {
    const puzzle = puzzles.find(puzzle => puzzle._id === config.currentPuzzle);
    if (puzzle) return puzzle.categories;
    else return [];
  }
);

export const getCurrentPuzzle = createArrayEqualSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) =>
    puzzles.find(puzzle => puzzle._id === config.currentPuzzle)
);

export const getCurrentPuzzleIndex = createArrayEqualSelector(
  [getPuzzles, getConfig],
  (puzzles: Puzzle[], config: Config) =>
    puzzles.findIndex(puzzle => puzzle._id === config.currentPuzzle)
);

export const getCurrentCategoryIndex = createArrayEqualSelector(
  [getCategories, getConfig],
  (categories: string[], config: Config) =>
    categories.findIndex(category => category === config.currentCategory)
);

const getSolves = (state: StoreState) => state.docs.solves;

export const getCurrentPuzzleSolves = createArrayEqualSelector(
  [getSolves, getConfig],
  (solves, config) =>
    solves.filter(
      solve =>
        solve.puzzle === config.currentPuzzle &&
        solve.category === config.currentCategory
    )
);

export const getCurrentSolves = createArrayEqualSelector(
  getCurrentPuzzleSolves,
  solves => filterCurrentSolves(solves)
);

export const getHistorySolves = createArrayEqualSelector(
  getCurrentPuzzleSolves,
  solves => filterCurrentSolves(solves, false)
);

export const NOT_ENOUGH_SOLVES = -1;

const getAverageFactory = (count: number) =>
  createArrayEqualSelector(getCurrentSolves, (solves: Solve[]) => {
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
  createArrayEqualSelector(getCurrentSolves, (solves: Solve[]) => {
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

const docIsType = (doc: Doc, type: string) => {
  return doc._id.startsWith(type);
};

const createDocReducer = (type: string, initialDoc: Doc) => (
  state: Doc = initialDoc,
  action: Action
) => {
  switch (action.type) {
    case DB_DOCS_FETCHED:
      return action.payload.find((doc: Doc) => docIsType(doc, type));
    case DB_DOC_ADD_UPDATED:
      if (docIsType(action.payload, type)) {
        return action.payload;
      } else {
        return state;
      }
    default:
      return state;
  }
};

const createDocsReducer = (
  type: string,
  solvesFilter?: (docs: Doc[], puzzle: string) => Doc[]
) => (state: Doc[] = [], action: Action) => {
  let newState = state;
  switch (action.type) {
    case DB_DOCS_FETCHED:
      newState = action.payload.filter((doc: Doc) => docIsType(doc, type));
      break;
    case DB_DOC_ADD_UPDATED:
      if (!docIsType(action.payload, type)) {
        break;
      }

      const exists = state.find(solve => solve._id === action.payload._id);

      if (exists) {
        // UPDATE
        newState = state.map(solve => {
          return solve._id === action.payload._id
            ? { ...solve, ...action.payload }
            : solve;
        });
      } else {
        // ADD
        newState = [...state, action.payload];
      }
      break;
    case DB_DOC_DELETED:
      newState = state.filter(solve => solve._id !== action.payload);
      break;
    default:
      return state;
  }

  newState = sortDocs(newState);
  return newState;
};

const TIME_BETWEEN_SESSIONS = 900000;
const getTimestamp = (solve: Solve) => {
  return parse(solve.timestamp).getTime();
};
const filterCurrentSolves = (solves: Solve[], current = true) => {
  let divPoint = solves.length;
  for (let i = solves.length; i >= 1; i--) {
    let newSolveTimestamp;
    if (i === solves.length) {
      newSolveTimestamp = Math.floor(Date.now() / 1000);
    } else {
      const newSolve = solves[i];
      newSolveTimestamp = getTimestamp(newSolve);
    }

    const solve = solves[i - 1];
    const solveTimstamp = getTimestamp(solve);

    //If the solve is 15 minutes later than the last one, count as new session
    if (newSolveTimestamp - solveTimstamp > TIME_BETWEEN_SESSIONS) {
      divPoint = i;
      break;
    }
  }

  return current ? solves.slice(divPoint) : solves.slice(0, divPoint);
};

export interface DocsStoreState {
  config: Config;
  puzzles: Puzzle[];
  solves: Solve[];
}

const initialConfig = new Config('', '');

export const docsReducer = combineReducers({
  config: createDocReducer('config', initialConfig),
  puzzles: createDocsReducer('puzzle'),
  solves: createDocsReducer('solve')
});
