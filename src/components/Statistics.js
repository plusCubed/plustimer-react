// @flow

import { h } from 'preact';
import * as React from '../utils/preact';
import { connect } from 'unistore/full/preact.es';

import { formatTime, mean } from '../utils/utils';

import style from './Statistics.css';

import { Penalty } from './SolvesList';
import type { Solve } from './SolvesList';

const NOT_ENOUGH_SOLVES = -1;
const NOT_APPLICABLE = -2;

const getActualTime = (solve: Solve) => {
  switch (solve.penalty) {
    case Penalty.DNF:
      return Number.MAX_VALUE;
    case Penalty.PLUS_TWO:
      return solve.time + 2000;
    case Penalty.NONE:
    default:
      return solve.time;
  }
};

const getNSolves = (count: number, solves: Solve[], best: boolean) => {
  solves = solves.slice().map(solve => getActualTime(solve));
  if (best) {
    // Best MoN
    solves = solves.sort((a, b) => a - b).slice(0, count);
  } else {
    // Current MoN
    solves = solves.slice(0, count).sort((a, b) => a - b);
  }
  return solves;
};

const getMean = (count: number, solves: Solve[], best: boolean) => {
  if (solves.length >= count) {
    solves = getNSolves(count, solves, best);
    if (solves.includes(Number.MAX_VALUE)) return Number.MAX_VALUE;
    else return mean(solves);
  } else {
    return NOT_ENOUGH_SOLVES;
  }
};

const getAverage = (count: number, solves: Solve[], best: boolean) => {
  if (solves.length >= count) {
    const trim = Math.ceil(count / 20);
    solves = getNSolves(count, solves, best).slice(trim, count - trim);

    if (solves.includes(Number.MAX_VALUE)) return Number.MAX_VALUE;
    else return mean(solves);
  } else {
    return NOT_ENOUGH_SOLVES;
  }
};

@connect('sessions')
class StatisticsWrapper extends React.PureComponent<{ sessions: [[Solve]] }> {
  render() {
    const solves = this.props.sessions[0];
    const stats = [];

    stats.push({
      name: 'Single',
      current: NOT_APPLICABLE,
      best: getMean(1, solves, true)
    });

    if (solves.length >= 3) {
      stats.push({
        name: 'Mo3',
        current: getMean(3, solves, false),
        best: getMean(3, solves, true)
      });
    }

    [5, 12, 50, 100, 500, 1000].every(count => {
      if (solves.length < count) {
        return false;
      }
      stats.push({
        name: `Ao${count}`,
        current: getAverage(count, solves, false),
        best: getAverage(count, solves, true)
      });
      return true;
    });

    return <Statistics stats={stats} />;
  }
}

const buildStatsTimeString = (time: number) => {
  switch (time) {
    case NOT_ENOUGH_SOLVES:
      return '--';
    case NOT_APPLICABLE:
      return 'N/A';
    case Number.MAX_VALUE:
      return 'DNF';
    default:
      return formatTime(time);
  }
};

const Statistics = ({
  stats
}: {
  stats: [{ name: string, current: number, best: number }]
}) => {
  return (
    <div className={style.stats}>
      <table>
        <thead>
          <tr>
            <td className={style.type} />
            <td>Current</td>
            <td>Best</td>
          </tr>
        </thead>
        <tbody>
          {stats.map(({ name, current, best }) => (
            <tr>
              <td className={style.type}>{name}</td>
              <td>{buildStatsTimeString(current)}</td>
              <td>{buildStatsTimeString(best)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsWrapper;
