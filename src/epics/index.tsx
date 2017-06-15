import timerEpic from './timer';
import solvesEpic from './solves';
import {combineEpics} from 'redux-observable';

const rootEpic = combineEpics(
    timerEpic,
    solvesEpic
);

export default rootEpic;