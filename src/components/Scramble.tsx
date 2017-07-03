import * as React from 'react';
import './Scramble.css';

export interface StoreStateProps {
  readonly scramble: string;
}

export interface DispatchProps {}

export interface Props extends StoreStateProps, DispatchProps {}

export const Scramble = ({ scramble }: Props) => {
  return (
    <div className="scramble">
      {scramble}
    </div>
  );
};
