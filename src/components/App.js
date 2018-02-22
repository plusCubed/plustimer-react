// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';

import style from './App.css';

import AppBar from '../components/AppBar';
import TimerContainer from '../components/TimerDisplayContainer';
import SolvesListContainer from '../components/SolvesListContainer';

type Props = {
  signingIn: boolean
};

const SigningInDialog = () => {
  return (
    <div className={style.dialog}>
      <div className={style.dialogBody}>
        <div className={style.dialogText}>Signing in...</div>
        <div className={style.progress}>
          <div className={style.indeterminate} />
        </div>
      </div>
    </div>
  );
};

const App = (props: Props) => {
  return (
    <div className={style.app}>
      {props.signingIn && <SigningInDialog />}
      <AppBar />
      <TimerContainer />
      <SolvesListContainer />
    </div>
  );
};

export default App;
