import {ActionsObservable, combineEpics, Epic} from 'redux-observable';
import {Observable, Scheduler} from 'rxjs/Rx';
import {CANCEL, DOWN, UP} from '../reducers/timerMode';
import {resetTimer, START_TIMER, startTimer, STOP_TIMER, stopTimer, tickTimer} from '../reducers/timerTime';
import {Action} from '../utils/Util';
import {Solve, SolvesService} from '../services/solves-service';

// The new mode & which action it corresponds to
export const transitionTimeMap = {
    'TIMER/DOWN': {
        'handOnTimer': resetTimer,
        'stopped': stopTimer
    },
    'TIMER/UP': {
        'running': startTimer,
        'ready': null
    },
    'TIMER/CANCEL': {
        'ready': resetTimer
    }
};

export const modeToTimeEpic = (action$: ActionsObservable<Action>, store: any) => {
    return Observable.merge(action$.ofType(UP), action$.ofType(DOWN), action$.ofType(CANCEL))
        .flatMap(action => {
            const timerMode = store.getState().timer.mode;
            if (timerMode in transitionTimeMap[action.type]) {
                const timeActionCreator = transitionTimeMap[action.type][timerMode];
                if (!!timeActionCreator) {
                    return Observable.of(timeActionCreator(action.payload.timestamp));
                }
            }
            return Observable.empty();
        });
};

export const timeToTickEpic = (action$: ActionsObservable<Action>) => {
    return action$.ofType(START_TIMER)
        .flatMap(action => {
            return Observable.of(0, Scheduler.animationFrame)
                .repeat()
                .takeUntil(action$.ofType(STOP_TIMER))
                .map(i => tickTimer(performance.now()));
        });
};

export const finishSolveEpic = (action$: ActionsObservable<Action>,
                                store: any,
                                {solvesService}: { solvesService: SolvesService }) => {
    return action$.ofType(UP)
        .filter(action => store.getState().timer.mode === 'ready')
        .flatMap(action => {
            const timerState = store.getState().timer;
            const solve = new Solve(timerState.time.elapsed, timerState.time.stoppedTimestamp, '');
            solvesService.add(solve);

            return Observable.empty();
        });
};

export default combineEpics(modeToTimeEpic, timeToTickEpic, finishSolveEpic as Epic<Action, {}>);
