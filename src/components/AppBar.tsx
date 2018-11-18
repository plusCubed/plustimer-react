import { h } from 'preact';

import ProfileContainer from './ProfileContainer';
import PuzzleSelect from './PuzzleSelect';
import * as style from './AppBar.css';

const AppBar = () => {
  return (
    <header className={style.toolbar}>
{/*
      <PuzzleSelect />
*/}

      <span className={style.toolbarSpacer} />

      <ProfileContainer />
    </header>
  );
};

export default AppBar;
