import * as React from 'react';
import './Scramble.css';
import { TextFit, TextFitSettings } from './FitText';

export interface StoreStateProps {
  readonly scramble: string;
}

export interface DispatchProps {}

export interface Props extends StoreStateProps, DispatchProps {}

const fitTextSettings: TextFitSettings = {
  maxFontSize: 40,
  multiLine: true,
  reProcess: true
};

export const Scramble = ({ scramble }: Props) => {
  return (
    <TextFit className="scramble" text={scramble} settings={fitTextSettings} />
  );
};
