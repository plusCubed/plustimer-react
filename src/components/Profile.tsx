import { h } from 'preact';
import PureComponent from './PureComponent';
import * as style from './AppBar.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

interface ProfileProps {
  loggedIn: boolean;
  avatarImg: string;
  onLoginClick: (() => void);
  onAvatarClick: (() => void);
}

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
