import PouchDB from 'pouchdb-browser';
import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import {
  dbDocAddUpdated,
  dbDocDeleted,
  dbDocsFetched,
  SELECT_PUZZLE,
  SELECT_CATEGORY,
  getConfig,
  getPuzzles,
  getCurrentPuzzle,
  puzzleSelected,
  categorySelected,
  DELETE_SOLVE
} from '../reducers/docs';
import { Puzzle, Solve, SolvesService } from '../services/solves-service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';

import { catchEmitError } from './errorHandling';
import { LOGIN_SUCCESS } from '../reducers/account';
import { Session } from '@pluscubed/superlogin-client';
import { Action } from '../reducers/index';
import { LightStore } from './index';

const dbSolvesEpic = (
  action$: ActionsObservable<Action>,
  store: any,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  // Doesn't actually care about actions. Grabs solves and starts observing updates to database

  const allSolves$ = solvesService
    .getAllDocs()
    .map((solves: Solve[]) => {
      return dbDocsFetched(solves);
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
  dbSolvesEpic as Epic<Action, {}>,
  deleteSolveEpic as Epic<Action, {}>,
  startSyncEpic as Epic<Action, {}>,
  selectPuzzleEpic as Epic<Action, {}>,
  selectCategoryEpic as Epic<Action, {}>
);
