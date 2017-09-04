import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import { catchEmitError } from '../utils/errorHandling';
import { AccountService } from '../services/accountService';
import { LOGIN, loginSuccess } from '../reducers/accountReducer';
import { Action } from '../reducers/index';
import { Dependencies } from './index';

const signInEpic: Epic<Action, any, Dependencies> = (
  action$: ActionsObservable<Action>,
  store: any,
  { accountService }: { accountService: AccountService }
): Observable<Action> => {
  const loginSuccess$ = accountService
    .authenticate()
    .map(session => loginSuccess(session));

  const login$ = action$.ofType(LOGIN).flatMap(() => {
    return accountService.login();
  });

  return Observable.merge(loginSuccess$, login$).let(catchEmitError);
};

export default combineEpics(signInEpic);
