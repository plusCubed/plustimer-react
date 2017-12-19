// @flow

import * as React from 'react';

import style from './App.css';

import AppBar from './AppBar';
import TimerDisplayContainer from '../containers/TimerDisplayContainer';
import SolvesListContainer from '../containers/SolvesListContainer';

const App = () => {
  return (
    <div className={style.app}>
      <AppBar />
      <TimerDisplayContainer />
      <SolvesListContainer />
    </div>
  );
};

export default App;
