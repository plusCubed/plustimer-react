import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { Action } from '../reducers/index';

export const catchEmitError = (obs: Observable<Action>): Observable<Action> => {
  return obs.catch((err: Error, caught: Observable<Action>) => {
    console.log(err);
    return Observable.of({
      type: 'ERROR',
      payload: err.toString(),
      error: true
    });
  });
};
