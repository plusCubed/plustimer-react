import timerEpic from './timer';
import solvesEpic from './solves';
import accountEpic from './account';
import { combineEpics } from 'redux-observable';

export type LightStore = { getState: Function; dispatch: Function };

const rootEpic = combineEpics(timerEpic, solvesEpic, accountEpic);

export default rootEpic;
