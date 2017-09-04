import * as React from 'react';
import './Statistics.css';
import { formatTime } from '../utils/util';

export interface DispatchProps {}

export interface StoreStateProps {
  currAo5: number;
  currAo12: number;
  bestAo5: number;
  bestAo12: number;
}

interface Props extends DispatchProps, StoreStateProps {}

export const Statistics = ({ currAo5, currAo12, bestAo5, bestAo12 }: Props) => {
  return (
    <div className="stats">
      <table>
        <thead>
          <tr>
            <td className="type" />
            <td>current</td>
            <td>best</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="type">Ao5</td>
            <td>{formatTime(currAo5)}</td>
            <td>{formatTime(bestAo5)}</td>
          </tr>
          <tr>
            <td className="type">Ao12</td>
            <td>{formatTime(currAo12)}</td>
            <td>{formatTime(bestAo12)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
