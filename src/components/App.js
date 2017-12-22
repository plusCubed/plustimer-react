// @flow

import * as React from 'react';

import style from './App.css';

import AppBarContainer from '../containers/AppBarContainer';
import TimerContainer from '../containers/TimerDisplayContainer';
import SolvesListContainer from '../containers/SolvesListContainer';

const App = () => {
  return (
    <div className={style.app}>
      <AppBarContainer />
      <TimerContainer />
      <SolvesListContainer />
    </div>
  );
};

export default App;
