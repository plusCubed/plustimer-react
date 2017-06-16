import * as PouchDB from 'pouchdb';
import {ActionsObservable, combineEpics, Epic} from 'redux-observable';
import {Action} from '../utils/Util';
import {addUpdateSolve, deleteSolve, fetchSolvesSuccess} from '../reducers/solves';
import {Solve, SolvesService} from '../services/solves-service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import {catchEmitError} from './errorHandling';

const dbSolvesEpic = (action$: ActionsObservable<Action>,
                      store: any,
                      {solvesService}: { solvesService: SolvesService }): Observable<Action> => {

    // Doesn't actually care about actions. Grabs solves and starts observing updates to database

    const allSolves$ = solvesService.getAll()
        .map((solves: Solve[]) => fetchSolvesSuccess(solves))
        .let(catchEmitError);

    const changes$ = solvesService.getChanges()
        .map((change: PouchDB.Core.ChangesResponseChange<Solve>) => {
            if (change.doc!._deleted) {
                return deleteSolve(change.doc!._id);
            } else {
                return addUpdateSolve(change.doc!);
            }
        });

    return Observable.merge(allSolves$, changes$)
        .let(catchEmitError);
};

export default combineEpics(dbSolvesEpic as Epic<Action, {}>);