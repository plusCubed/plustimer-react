import {ActionsObservable, combineEpics, Epic} from 'redux-observable';
import {Action} from '../utils/Util';
import {addUpdateSolve, deleteSolve, fetchSolvesSuccess} from '../reducers/solves';
import {Solve, SolvesService} from '../services/solves-service';
import {Observable} from 'rxjs/Rx';

const dbSolvesEpic = (action$: ActionsObservable<Action>,
                      store: any,
                      {solvesService}: { solvesService: SolvesService }): Observable<Action> => {

    // Doesn't actually care about actions. Grabs solves and starts observing updates to database

    const allSolves$ = solvesService.getAll()
        .map((solves: Solve[]) => fetchSolvesSuccess(solves));

    const changes$ = solvesService.getChanges()
        .map((change: PouchDB.Core.ChangesResponseChange<Solve>) => {
            if (change.doc!._deleted) {
                return deleteSolve(change.doc!._id);
            } else {
                return addUpdateSolve(change.doc!);
            }
        });

    return Observable.merge(allSolves$, changes$);
};

export default combineEpics(dbSolvesEpic as Epic<Action, {}>);