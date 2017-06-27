import {ActionsObservable, combineEpics, Epic} from 'redux-observable';
import {Action} from '../utils/Util';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import {catchEmitError} from './errorHandling';
import {AccountService} from '../services/account-service';
import {SIGN_IN} from '../reducers/account';

const signInEpic = (action$: ActionsObservable<Action>,
                    store: any,
                    {accountService}: { accountService: AccountService }): Observable<Action> => {

    const signIn$ = action$.ofType(SIGN_IN)
        .flatMap(() => {
            return accountService.login()
                .map(session => {
                    return {
                        type: 'SIGN_IN_SESSION',
                        payload: session
                    } as Action;
                });
        });

    return Observable.merge(signIn$)
        .let(catchEmitError);
};

export default combineEpics(signInEpic as Epic<Action, {}>);