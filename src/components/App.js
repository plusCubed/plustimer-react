// @flow

import { h } from 'preact';
import * as React from '../utils/preact';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';

import style from './App.css';

import AppBar from '../components/AppBar';
import TimerContainer from '../components/TimerDisplayContainer';
import SolvesListContainer from '../components/SolvesListContainer';

type Props = {
  signingIn: boolean,
  updateAvailable: boolean
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

class UpdateAvailable extends React.PureComponent {
  handleRefresh = () => {
    window.location.reload();
  };
  render() {
    return (
      <div className={style.snackbar}>
        <span>Update available!</span>
        <span className={style.snackbarSpacer} />
        <Button className={style.snackbarButton} onClick={this.handleRefresh}>
          Refresh
        </Button>
      </div>
    );
  }
}

const App = (props: Props) => {
  return (
    <div className={style.app}>
      {props.signingIn ? <SigningInDialog /> : null}
      <AppBar />
      <TimerContainer />
      <SolvesListContainer />
      {props.updateAvailable ? <UpdateAvailable /> : null}
    </div>
  );
};

export default App;
