import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import { Action } from '../utils/Util';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import { catchEmitError } from './errorHandling';
import { AccountService } from '../services/account-service';
import { LOGIN, loginSuccess } from '../reducers/account';

const signInEpic = (
  action$: ActionsObservable<Action>,
  store: any,
  { accountService }: { accountService: AccountService }
): Observable<Action> => {
  const loginSuccess$ = accountService
    .authenticate()
    .map(session => loginSuccess(session));

  const login$ = action$.ofType(LOGIN).flatMap(() => {
    return accountService.login().flatMap(session => Observable.empty());
  });

  return Observable.merge(loginSuccess$, login$).let(catchEmitError);
};

export default combineEpics(signInEpic as Epic<Action, {}>);
