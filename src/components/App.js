// @flow

import * as React from 'react';

import style from './App.css';

import AppBar from '../components/AppBar';
import TimerContainer from '../containers/TimerDisplayContainer';
import SolvesListContainer from '../containers/SolvesListContainer';

type Props = {
  onPuzzleChange: event => void,
  onCategoryChange: event => void
};

const App = () => {
  return (
    <div className={style.app}>
      <AppBar />
      <TimerContainer />
      <SolvesListContainer />
    </div>
  );
};

export default App;
