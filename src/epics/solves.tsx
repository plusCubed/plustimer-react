import * as PouchDB from 'pouchdb';
import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import { addUpdateDoc, deleteDoc, fetchDocsSuccess } from '../reducers/solves';
import { Solve, SolvesService } from '../services/solves-service';

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

export default combineEpics(
  dbSolvesEpic as Epic<Action, {}>,
  startSyncEpic as Epic<Action, {}>
);
