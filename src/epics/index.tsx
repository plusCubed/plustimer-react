import {combineEpics} from 'redux-observable';

import timerEpic from './timer';

const rootEpic = combineEpics(
    timerEpic,
);

export default rootEpic;