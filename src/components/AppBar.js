// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';

import ProfileContainer from '../containers/ProfileContainer';
import PuzzleSelect from '../containers/PuzzleSelect';

import style from './AppBar.css';

type Props = {};

const AppBar = () => {
  return (
    <header className={style.toolbar}>
      <PuzzleSelect />

      <span className={style.toolbarSpacer} />

      <ProfileContainer />
    </header>
  );
};

export default AppBar;
