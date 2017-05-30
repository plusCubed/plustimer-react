import {ActionsObservable, combineEpics} from 'redux-observable';
import {Observable, Scheduler} from 'rxjs/Rx';
import {CANCEL, DOWN, UP} from '../reducers/timerMode';
import {START_TIMER, STOP_TIMER, tickTimer, transitionTimeMap} from '../reducers/timerTime';
import {Action} from '../utils/Util';

const transitionModeActionToTimeAction = (actionType: string, timerMode: string): Observable<Action> => {
    if (timerMode in transitionTimeMap[actionType]) {
        const timeActionCreator = transitionTimeMap[actionType][timerMode];
        if (!!timeActionCreator) {
            return Observable.of(timeActionCreator());
        }
    }
    return Observable.empty();
};

export const modeActionToTimeAction = (action$: ActionsObservable<Action>, store: any) => {
    return Observable.merge(action$.ofType(UP), action$.ofType(DOWN), action$.ofType(CANCEL))
        .flatMap(action => {
            return transitionModeActionToTimeAction(action.type, store.getState().timer.mode);
        });
};

export const timeActionToTick = (action$: ActionsObservable<Action>) => {
    return action$.ofType(START_TIMER)
        .flatMap(action => {
            return Observable.of(0, Scheduler.animationFrame)
                .repeat()
                .takeUntil(action$.ofType(STOP_TIMER))
                .map(i => tickTimer());
        });
};

export default combineEpics(modeActionToTimeAction, timeActionToTick);
