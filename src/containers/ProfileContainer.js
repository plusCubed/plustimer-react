// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';

import { connect } from 'unistore/full/preact.es';

import Profile from '../components/Profile';
import firebase from '../utils/firebase';

type Props = {
  uid: string,
  wcaProfile: any
};

@connect('uid,wcaProfile')
class ProfileContainer extends React.PureComponent<Props, void> {
  handleLoginClick = async () => {
    window.open('popup.html', '_blank', 'height=585,width=400');
  };

  handleAvatarClick = async () => {
    const auth = await firebase.auth();
    await auth.signOut();
  };

  componentWillUnmount() {}

  render() {
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
