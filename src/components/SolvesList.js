// @flow

import * as React from 'react';

import style from './SolvesList.css';
import { formatTime } from '../utils/utils';

export const Penalty = {
  NORMAL: 0,
  PLUS_TWO: 1,
  DNF: 2
};

export class Solve {
  id: string;
  time: number;
  timestamp: Date;
  scramble: string;
  penalty: number;

  constructor(
    time: number,
    timestamp: Date,
    scramble: string,
    penalty: number
  ) {
    this.id = '';
    this.time = time;
    this.timestamp = timestamp;
    this.scramble = scramble;
    this.penalty = penalty;
  }
}

type Props = {
  solves: Solve[]
};

const SolvesList = ({ solves }: Props) => {
  return (
    <div className={style.solves}>
      {solves.map(solve => (
        <div key={solve.id} className={style.solveItem}>
          {formatTime(solve.time)}
        </div>
      ))}
    </div>
  );
};

export default SolvesList;
