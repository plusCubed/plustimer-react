// @flow

import * as React from 'react';

import style from './AppBar.css';

type Props = {
  onLoginClick: () => void
};

const AppBar = (props: Props) => {
  return (
    <header className={style.toolbar}>
      <div className={style.toolbarText}>plusTimer</div>
      <button className={style.toolbarButton} onClick={props.onLoginClick}>
        Login
      </button>
    </header>
  );
};

export default AppBar;
