import {ActionsObservable, combineEpics, Epic} from 'redux-observable';
import {Observable, Scheduler} from 'rxjs/Rx';
import {CANCEL, DOWN, UP} from '../reducers/timerMode';
import {resetTimer, START_TIMER, startTimer, STOP_TIMER, stopTimer, tickTimer} from '../reducers/timerTime';
import {Action} from '../utils/Util';
import {Solve, SolvesService} from '../services/solves-service';
import {ScrambleService} from '../services/scramble.service';
import {advanceScramble, FETCH_SCRAMBLE_SUCCESS, fetchScrambleStart, fetchScrambleSuccess} from '../reducers/scramble';

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

export const modeToTimeEpic = (action$: ActionsObservable<Action>, store: any): Observable<Action> => {
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

export const timeToTickEpic = (action$: ActionsObservable<Action>): Observable<Action> => {
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
                                {solvesService}: { solvesService: SolvesService }): Observable<Action> => {
    return action$.ofType(UP)
        .filter(action => store.getState().timer.mode === 'ready')
        .flatMap(action => {
            const timerState = store.getState().timer;
            const solve = new Solve(timerState.time.elapsed, timerState.time.stoppedTimestamp, '');
            solvesService.add(solve);

            return Observable.empty();
        });
};

export const fetchScrambleEpic = (action$: ActionsObservable<Action>,
                                  store: any,
                                  {scrambleService}: { scrambleService: ScrambleService }): Observable<Action> => {

    const triggerFetchScramble$ = action$.ofType(UP)
        .filter(action => store.getState().timer.mode === 'running')
        .startWith({type: 'SCRAMBLE_ON_START'} as Action);

    return triggerFetchScramble$
        .flatMap(action =>
            scrambleService.getScramble()
                .map(scramble => fetchScrambleSuccess(scramble))
                .startWith(fetchScrambleStart())
        );
};

export const advanceScrambleEpic = (action$: ActionsObservable<Action>, store: any): Observable<Action> => {
    const triggerAdvanceScramble$ = action$.ofType(UP)
        .filter(action => store.getState().timer.mode === 'ready')
        .startWith({type: 'ADVANCE SCRAMBLE_ON_START'} as Action);
    const fetchScrambleSuccess$ = action$.ofType(FETCH_SCRAMBLE_SUCCESS);

    return Observable.zip(fetchScrambleSuccess$, triggerAdvanceScramble$)
        .map(actions => {
            return advanceScramble();
        });
};

export default combineEpics(
    modeToTimeEpic,
    timeToTickEpic,
    finishSolveEpic as Epic<Action, {}>,
    fetchScrambleEpic as Epic<Action, {}>,
    advanceScrambleEpic
);
