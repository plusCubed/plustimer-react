import { h } from 'preact';
import PureComponent from './PureComponent';

import { connect } from 'unistore/full/preact';

import firebase from '../utils/asyncFirebase';
import Profile from './Profile';

interface Props {
  uid?: string;
  wcaProfile?: any;
}

@connect('uid,wcaProfile')
class ProfileContainer extends PureComponent<Props, {}> {
  public handleLoginClick = async () => {
    window.open('popup.html', '_blank', 'height=585,width=400');
  };

  public handleAvatarClick = async () => {
    const auth = await firebase.auth();
    await auth.signOut();
  };

  public componentWillUnmount() {}

  public render() {
    return (
      <Profile
        loggedIn={!!this.props.wcaProfile}
        avatarImg={
          this.props.wcaProfile ? this.props.wcaProfile.avatar.thumb_url : ''
        }
        onAvatarClick={this.handleAvatarClick}
        onLoginClick={this.handleLoginClick}
      />
    );
  }
}

export default ProfileContainer;
