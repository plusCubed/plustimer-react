// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';
import Portal from 'preact-portal';

import style from './App.css';

import AppBar from '../components/AppBar';
import TimerContainer from '../containers/TimerDisplayContainer';
import SolvesListContainer from '../containers/SolvesListContainer';

type Props = {
  signingIn: boolean
};

const SigningInDialog = () => {
  return (
    <Portal into="body">
      <div className={style.dialog}>
        <div className={style.dialogBody}>
          <div className={style.dialogText}>Signing in...</div>
          <div className={style.progress}>
            <div className={style.indeterminate} />
          </div>
        </div>
      </div>
    </Portal>
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
