// @flow

import * as React from 'react';

import style from './App.css';

import AppBarContainer from '../containers/AppBarContainer';
import TimerContainer from '../containers/TimerDisplayContainer';
import SolvesListContainer from '../containers/SolvesListContainer';

type Props = {
  uid: string,
  wcaProfile: any
};

const App = ({ uid, wcaProfile }: Props) => {
  return (
    <div className={style.app}>
      <AppBarContainer uid={uid} wcaProfile={wcaProfile} />
      <TimerContainer uid={uid} />
      <SolvesListContainer uid={uid} />
    </div>
  );
};

export default App;
