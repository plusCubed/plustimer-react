import { ActionsObservable, combineEpics, Epic } from 'redux-observable';
import { CANCEL, DOWN, UP } from '../reducers/timerMode';
import {
  resetTimer,
  START_TIMER,
  startTimer,
  STOP_TIMER,
  stopTimer,
  tickTimer
} from '../reducers/timerTime';
import { Puzzle, Solve, SolvesService } from '../services/solves-service';
import { ScrambleService } from '../services/scramble-service';
import {
  advanceScramble,
  FETCH_SCRAMBLE_SUCCESS,
  fetchScrambleStart,
  fetchScrambleSuccess,
  getCurrentScramble
} from '../reducers/scramble';
import { Observable } from 'rxjs/Observable';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/let';
import { catchEmitError } from './errorHandling';
import { Action } from '../reducers/index';
import {
  CATEGORY_SELECTED,
  getConfig,
  getCurrentPuzzle,
  PUZZLE_SELECTED,
  FETCH_DOCS_SUCCESS
} from '../reducers/solves';

// The new mode & which action it corresponds to
export const transitionTimeMap = {
  'TIMER/DOWN': {
    handOnTimer: resetTimer,
    stopped: stopTimer
  },
  'TIMER/UP': {
    running: startTimer,
    ready: null
  },
  'TIMER/CANCEL': {
    ready: resetTimer
  }
};

export const modeToTimeEpic = (
  action$: ActionsObservable<Action>,
  store: any
): Observable<Action> => {
  return Observable.merge(
    action$.ofType(UP),
    action$.ofType(DOWN),
    action$.ofType(CANCEL)
  )
    .flatMap(action => {
      const timerMode = store.getState().timer.mode;
      if (timerMode in transitionTimeMap[action.type]) {
        const timeActionCreator = transitionTimeMap[action.type][timerMode];
        if (!!timeActionCreator) {
          return Observable.of(timeActionCreator(action.payload.timestamp));
        }
      }
      return Observable.empty();
    })
    .let(catchEmitError);
};

export const timeToTickEpic = (
  action$: ActionsObservable<Action>
): Observable<Action> => {
  return action$
    .ofType(START_TIMER)
    .flatMap(action => {
      return Observable.of(0, animationFrame)
        .repeat()
        .takeUntil(action$.ofType(STOP_TIMER))
        .map(i => tickTimer(performance.now()));
    })
    .let(catchEmitError);
};

export const finishSolveEpic = (
  action$: ActionsObservable<Action>,
  store: any,
  { solvesService }: { solvesService: SolvesService }
): Observable<Action> => {
  return action$
    .ofType(UP)
    .filter(action => store.getState().timer.mode === 'ready')
    .flatMap(action => {
      const timerState = store.getState().timer;
      const config = getConfig(store.getState());
      const solve = new Solve(
        config.currentPuzzle,
        config.currentCategory,
        timerState.time.elapsed,
        timerState.time.stoppedTimestamp,
        getCurrentScramble(store.getState()),
        0
      );
      solvesService.add(solve);

      return Observable.empty();
    })
    .let(catchEmitError);
};

export const fetchScrambleEpic = (
  action$: ActionsObservable<Action>,
  store: any,
  { scrambleService }: { scrambleService: ScrambleService }
): Observable<Action> => {
  const docsFetchedAction$ = action$.ofType(FETCH_DOCS_SUCCESS);

  const timerRunningAction$ = action$
    .ofType(UP)
    .filter(action => store.getState().timer.mode === 'running');

  const puzzleChangedAction$ = Observable.merge(
    action$.ofType(PUZZLE_SELECTED),
    action$.ofType(CATEGORY_SELECTED)
  );

  const triggleFetchScramble$ = Observable.merge(
    docsFetchedAction$,
    timerRunningAction$,
    puzzleChangedAction$
  );

  return triggleFetchScramble$
    .flatMap(action => {
      //PUZZLE_SELECTED has new puzzle as payload
      const scrambler =
        action.payload && action.payload.scrambler
          ? action.payload.scrambler
          : getCurrentPuzzle(store.getState())!.scrambler;

      return scrambleService
        .getScramble(scrambler)
        .map(scramble => fetchScrambleSuccess(scramble))
        .startWith(fetchScrambleStart());
    })
    .let(catchEmitError);
};

export const advanceScrambleEpic = (
  action$: ActionsObservable<Action>,
  store: any
): Observable<Action> => {
  const timerReadyAction$ = action$
    .ofType(UP)
    .filter(action => store.getState().timer.mode === 'ready')
    .startWith({ type: 'ADVANCE_ON_START' } as Action);

  const puzzleChangedAction$ = Observable.merge(
    action$.ofType(PUZZLE_SELECTED),
    action$.ofType(CATEGORY_SELECTED)
  );

  const fetchScrambleSuccess$ = action$.ofType(FETCH_SCRAMBLE_SUCCESS);

  const triggerAdvanceScramble$ = Observable.merge(
    timerReadyAction$,
    puzzleChangedAction$
  );

  return Observable.zip(fetchScrambleSuccess$, triggerAdvanceScramble$)
    .map(actions => {
      return advanceScramble();
    })
    .let(catchEmitError);
};

export default combineEpics(
  modeToTimeEpic,
  timeToTickEpic,
  finishSolveEpic as Epic<Action, {}>,
  fetchScrambleEpic as Epic<Action, {}>,
  advanceScrambleEpic
);
