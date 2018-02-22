// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';
import { connect } from 'unistore/full/preact.es';

import { formatTime, mean } from '../utils/utils';

import style from './Statistics.css';

import type { Solve } from './SolvesList';

const NOT_ENOUGH_SOLVES = -1;

const getCurrentAverage = (count: number, solves: Solve[]) => {
  if (solves.length >= count) {
    const lastNSolves = solves
      .slice()
      .slice(0, count)
      .map(solve => solve.time);
    const min = Math.min(...lastNSolves);
    const max = Math.max(...lastNSolves);
    return mean(lastNSolves.filter(time => time !== min && time !== max));
  } else {
    return NOT_ENOUGH_SOLVES;
  }
};

const getBestAverage = (count: number, solves: Solve[]) => {
  if (solves.length >= count) {
    const bestNSolves = solves
      .slice()
      .sort((a: Solve, b: Solve) => a.time - b.time)
      .slice(0, count)
      .map(solve => solve.time);
    const min = Math.min(...bestNSolves);
    const max = Math.max(...bestNSolves);
    return mean(bestNSolves.filter(time => time !== min && time !== max));
  } else {
    return NOT_ENOUGH_SOLVES;
  }
};

@connect('sessions')
class StatisticsWrapper extends React.PureComponent<{ sessions: [[Solve]] }> {
  render() {
    const averages = [];
    [5, 12, 50, 100, 500, 1000].every(count => {
      if (this.props.sessions[0].length < count && count >= 50) {
        return false;
      }
      averages.push({
        count: count,
        current: getCurrentAverage(count, this.props.sessions[0]),
        best: getBestAverage(count, this.props.sessions[0])
      });
      return true;
    });

    return <Statistics averages={averages} />;
  }
}

const buildTime = (time: number) => {
  if (time === NOT_ENOUGH_SOLVES) {
    return '--';
  }
  return formatTime(time);
};

const Statistics = ({
  averages
}: {
  averages: [{ count: number, current: number, best: number }]
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
          {averages.map(({ count, current, best }) => (
            <tr>
              <td className={style.type}>Ao{count}</td>
              <td>{buildTime(current)}</td>
              <td>{buildTime(best)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsWrapper;
