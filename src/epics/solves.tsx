import * as PouchDB from 'pouchdb';
import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import {
  addUpdateDoc,
  deleteDoc,
  fetchDocsSuccess,
  SELECT_PUZZLE,
  SELECT_CATEGORY,
  getConfig,
  getPuzzles,
  getCurrentPuzzle
} from '../reducers/solves';
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
      return fetchDocsSuccess(solves);
    })
    .let(catchEmitError);

  const changes$ = solvesService
    .getChanges()
    .map((change: PouchDB.Core.ChangesResponseChange<Solve>) => {
      if (change.doc!._deleted) {
        return deleteDoc(change.doc!._id);
      } else {
        return addUpdateDoc(change.doc!);
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
      const newConfig = {
        ...currentConfig,
        currentPuzzleId: puzzles[index]._id
      };
      solvesService.setConfig(newConfig);
      return Observable.empty();
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
      const puzzle = getCurrentPuzzle(store.getState());
      const newConfig = {
        ...currentConfig,
        currentCategory: puzzle!.categories[index]
      };
      solvesService.setConfig(newConfig);
      return Observable.empty();
    });

  return Observable.merge(selectCategory$).let(catchEmitError);
};

export default combineEpics(
  dbSolvesEpic as Epic<Action, {}>,
  startSyncEpic as Epic<Action, {}>,
  selectPuzzleEpic as Epic<Action, {}>,
  selectCategoryEpic as Epic<Action, {}>
);
