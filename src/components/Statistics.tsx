import { h } from 'preact';
import { connect } from 'unistore/full/preact';

import PureComponent from './PureComponent';

import { formatTime, mean } from '../utils/utils';

import style from './Statistics.css';

import { ISolve, Penalty } from './SolvesList';

const NOT_ENOUGH_SOLVES = -1;
const NOT_APPLICABLE = -2;

const getActualTime = (solve: ISolve) => {
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

const getNSolves = (count: number, solves: ISolve[], best: boolean) => {
  let solveTimes = solves.slice().map(solve => getActualTime(solve));
  if (best) {
    // Best MoN
    solveTimes = solveTimes.sort((a, b) => a - b).slice(0, count);
  } else {
    // Current MoN
    solveTimes = solveTimes.slice(0, count).sort((a, b) => a - b);
  }
  return solveTimes;
};

const getMean = (count: number, solves: ISolve[], best: boolean) => {
  if (solves.length >= count) {
    const solveTimes = getNSolves(count, solves, best);
    if (solveTimes.includes(Number.MAX_VALUE)) { return Number.MAX_VALUE; }
    else { return mean(solveTimes); }
  } else {
    return NOT_ENOUGH_SOLVES;
  }
};

const getAverage = (count: number, solves: ISolve[], best: boolean) => {
  if (solves.length >= count) {
    const trim = Math.ceil(count / 20);
    const solveTimes = getNSolves(count, solves, best).slice(trim, count - trim);

    if (solveTimes.includes(Number.MAX_VALUE)) { return Number.MAX_VALUE; }
    else { return mean(solveTimes); }
  } else {
    return NOT_ENOUGH_SOLVES;
  }
};

interface Props {
  sessions?: ISolve[][]
}

@connect('sessions')
class StatisticsWrapper extends PureComponent<Props, {}> {
  public render() {
    const solves = this.props.sessions[0];
    const stats: Array<{ name: string, current: number, best: number }> = [];

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
  stats: Array<{ name: string, current: number, best: number }>
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
