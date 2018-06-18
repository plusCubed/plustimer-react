// @flow

import { h } from 'preact';
import * as React from '../utils/preact';

import style from './AppBar.css';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

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
    <Button className={style.toolbarButton} onClick={props.onLoginClick}>
      Login
    </Button>
  );
};

export default Profile;
