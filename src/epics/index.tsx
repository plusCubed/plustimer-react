import {combineEpics} from 'redux-observable';

import timerEpic from './timer';
import solvesEpic from './solves';

const rootEpic = combineEpics(
    timerEpic,
    solvesEpic
);

export default rootEpic;