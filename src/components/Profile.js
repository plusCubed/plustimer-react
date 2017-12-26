// @flow

import * as React from 'react';

import style from './AppBar.css';

type ProfileProps = {
  loggedIn: boolean,
  avatarImg: string,
  onLoginClick: () => void,
  onAvatarClick: () => void
};

const Profile = (props: ProfileProps) => {
  return props.loggedIn ? (
    <img
      className={style.toolbarAvatar}
      alt="User Avatar"
      src={props.avatarImg}
      onClick={props.onAvatarClick}
    />
  ) : (
    <button className={style.toolbarButton} onClick={props.onLoginClick}>
      Login
    </button>
  );
};

export default Profile;
