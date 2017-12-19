// @flow

import * as React from 'react';

import style from './App.css';

import AppBar from './AppBar';
import TimerDisplayContainer from '../containers/TimerDisplayContainer';

class App extends React.PureComponent {
  render() {
    return (
      <div className={style.app}>
        <AppBar />
        <TimerDisplayContainer />
      </div>
    );
  }
}

export default App;
