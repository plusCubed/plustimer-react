// @flow

import * as React from 'react';

import ProfileContainer from '../containers/ProfileContainer';
import PuzzleSelect from '../containers/PuzzleSelect';

import style from './AppBar.css';

type Props = {
  uid: string,
  wcaProfile: any
};

const AppBar = (props: Props) => {
  return (
    <header className={style.toolbar}>
      <PuzzleSelect uid={props.uid} />

      <span className={style.toolbarSpacer} />

      <ProfileContainer uid={props.uid} wcaProfile={props.wcaProfile} />
    </header>
  );
};

export default AppBar;
