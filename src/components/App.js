// @flow

import * as React from 'react';

import style from './App.css';

import AppBar from '../components/AppBar';
import TimerContainer from '../containers/TimerDisplayContainer';
import SolvesListContainer from '../containers/SolvesListContainer';

type Props = {
  uid: string,
  wcaProfile: any,
  onPuzzleChange: event => void,
  onCategoryChange: event => void
};

const App = ({ uid, wcaProfile }: Props) => {
  return (
    <div className={style.app}>
      <AppBar uid={uid} wcaProfile={wcaProfile} />
      <TimerContainer uid={uid} />
      <SolvesListContainer uid={uid} />
    </div>
  );
};

export default App;
