// @flow

import * as React from 'react';

import style from './AppBar.css';

const AppBar = () => {
  return (
    <header className={style.toolbar}>
      <div className={style.toolbarText}>plusTimer</div>
    </header>
  );
};

export default AppBar;
