import * as React from 'react';
import './Scramble.css';
import { Textfit } from 'react-textfit';

export interface StoreStateProps {
  readonly scramble: string;
}

export interface DispatchProps {}

export interface Props extends StoreStateProps, DispatchProps {}

export const Scramble = ({ scramble }: Props) => {
  return (
    <Textfit className="scramble" max={40}>
      {scramble}
    </Textfit>
  );
};
