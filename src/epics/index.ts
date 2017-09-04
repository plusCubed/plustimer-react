import timerEpic from './timerEpic';
import solvesEpic from './solvesEpic';
import accountEpic from './accountEpic';
import { combineEpics, Epic } from 'redux-observable';
import { SolvesService } from '../services/solvesService';
import { ScrambleService } from '../services/scrambleService';
import { AccountService } from '../services/accountService';
import { Action } from '../reducers/index';

export type LightStore = { getState: Function; dispatch: Function };

export type Dependencies = {
  solvesService?: SolvesService;
  scrambleService?: ScrambleService;
  accountService?: AccountService;
};

const rootEpic: Epic<Action, LightStore, Dependencies> = combineEpics(
  timerEpic,
  solvesEpic,
  accountEpic
);

export default rootEpic;
