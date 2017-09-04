import PouchDB from 'pouchdb';
import { ActionsObservable, combineEpics, Epic } from 'redux-observable';

import {
  Config,
  Doc,
  Puzzle,
  Solve,
  SolvesService
} from '../services/solvesService';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';

import { catchEmitError } from '../utils/errorHandling';

import { Session } from '@pluscubed/superlogin-client';

import { LightStore } from './index';

import { Action } from '../reducers/index';
import { LOGIN_SUCCESS } from '../reducers/accountReducer';
import {
  dbDocAddUpdated,
  dbDocDeleted,
  dbDocsFetched,
  DELETE_SOLVE,
  getConfig,
  categorySelected,
  puzzleSelected,
  getPuzzles,
  getCurrentPuzzle,
  SELECT_CATEGORY,
  SELECT_PUZZLE
} from '../reducers/docsReducer';

const dbSolvesEpic = (
  action$: ActionsObservable<Action>,
  store: LightStore,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  // Doesn't actually care about actions. Grabs solves and starts observing updates to database

  const allSolves$ = solvesService
    .getAllDocs()
    .map((docs: Doc[]) => {
      return dbDocsFetched(docs);
    })
    .let(catchEmitError);

  const changes$ = solvesService
    .getChanges()
    .map((change: PouchDB.Core.ChangesResponseChange<Solve>) => {
      if (change.doc!._deleted) {
        return dbDocDeleted(change.doc!._id);
      } else {
        return dbDocAddUpdated(change.doc!);
      }
    });

  return Observable.concat(allSolves$, changes$).let(catchEmitError);
};

const startSyncEpic = (
  action$: ActionsObservable<Action>,
  store: any,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  //Start syncing when login is successful
  const startSync$ = action$
    .ofType(LOGIN_SUCCESS)
    .map(action => action.payload)
    .flatMap((session: Session) => {
      solvesService.startSync(session.userDBs['user']);
      return Observable.empty();
    });

  return Observable.merge(startSync$).let(catchEmitError);
};

const selectPuzzleEpic = (
  action$: ActionsObservable<Action>,
  store: LightStore,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  const selectPuzzle$ = action$
    .ofType(SELECT_PUZZLE)
    .map(action => action.payload)
    .flatMap((index: number) => {
      const currentConfig = getConfig(store.getState());
      const puzzles = getPuzzles(store.getState());
      const currentPuzzle = getCurrentPuzzle(store.getState());
      const newPuzzle = puzzles[index];

      if (currentPuzzle !== newPuzzle) {
        const newConfig = {
          ...currentConfig,
          currentPuzzle: newPuzzle._id,
          currentCategory: newPuzzle.categories[0]
        };
        solvesService.setConfig(newConfig);
        return Observable.of(puzzleSelected(newPuzzle));
      } else {
        return Observable.empty();
      }
    });

  return Observable.merge(selectPuzzle$).let(catchEmitError);
};

const selectCategoryEpic = (
  action$: ActionsObservable<Action>,
  store: LightStore,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  const selectCategory$ = action$
    .ofType(SELECT_CATEGORY)
    .map(action => action.payload)
    .flatMap((index: number) => {
      const currentConfig = getConfig(store.getState());
      const puzzle: Puzzle = getCurrentPuzzle(store.getState())!;
      const currentCategory = currentConfig.currentCategory;
      const newCategory = puzzle.categories[index];

      if (currentCategory !== newCategory) {
        const newConfig = {
          ...currentConfig,
          currentCategory: newCategory
        };
        solvesService.setConfig(newConfig);
        return Observable.of(categorySelected());
      } else {
        return Observable.empty();
      }
    });

  return Observable.merge(selectCategory$).let(catchEmitError);
};

const deleteSolveEpic = (
  action$: ActionsObservable<Action>,
  store: LightStore,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  const deleteSolve$ = action$
    .ofType(DELETE_SOLVE)
    .map(action => action.payload)
    .flatMap((solve: Solve) => {
      solvesService.remove(solve);
      return Observable.empty();
    });

  return Observable.merge(deleteSolve$).let(catchEmitError);
};

export default combineEpics(
  dbSolvesEpic,
  deleteSolveEpic,
  startSyncEpic,
  selectPuzzleEpic,
  selectCategoryEpic
);
