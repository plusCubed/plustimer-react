// @flow

import * as React from 'react';

import style from './AppBar.css';

type Props = {
  loggedIn: boolean,
  avatarImg: string,
  onLoginClick: () => void
};

const AppBar = (props: Props) => {
  return (
    <header className={style.toolbar}>
      <div className={style.toolbarText}>plusTimer</div>
      {props.loggedIn ? (
        <img
          className={style.toolbarAvatar}
          alt="User Avatar"
          src={props.avatarImg}
        />
      ) : (
        <button className={style.toolbarButton} onClick={props.onLoginClick}>
          Login
        </button>
      )}
    </header>
  );
};

export default AppBar;
