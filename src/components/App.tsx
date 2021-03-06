import { h } from 'preact';
import PureComponent from './PureComponent';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';

import AppBar from './AppBar';
import SolvesListContainer from './SolvesListContainer';
import TimerContainer from './TimerDisplayContainer';
import * as style from './App.css';
import { IPuzzle } from './AppWrapper';
import PuzzleSelect from './PuzzleSelect';

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

class UpdateAvailable extends PureComponent<{}, {}> {
  public readonly handleRefresh = () => {
    window.location.reload();
  };
  public render() {
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

interface IProps {
  signingIn: boolean;
  updateAvailable: boolean;
  puzzle: IPuzzle;
  puzzlesReady: boolean;
  currentSessionId: number;
}

const App = (props: IProps) => {
  return (
    <div className={style.app}>
      {/*{props.signingIn ? <SigningInDialog /> : null}*/}
      <AppBar>
        <PuzzleSelect puzzle={props.puzzle} puzzlesReady={props.puzzlesReady}/>
      </AppBar>
      <TimerContainer puzzle={props.puzzle} currentSessionId={props.currentSessionId}/>
      <SolvesListContainer puzzle={props.puzzle} currentSessionId={props.currentSessionId}/>
      {props.updateAvailable ? <UpdateAvailable /> : null}
    </div>
  );
};

export default App;
