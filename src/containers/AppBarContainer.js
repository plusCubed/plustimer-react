// @flow

import * as React from 'react';

import AppBar from '../components/AppBar';
import firebase from '../utils/firebase';

type Props = {
  uid: string,
  wcaProfile: any
};

class AppBarContainer extends React.PureComponent<Props, void> {
  handleLoginClick = async () => {
    const auth = await firebase.auth();
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      const oldIdToken = await auth.currentUser.getIdToken(true);
      window.open(
        `popup.html?oldIdToken=${oldIdToken}`,
        '_blank',
        'height=585,width=400'
      );
    }
  };

  handleAvatarClick = async () => {
    const auth = await firebase.auth();
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      await auth.signOut();
      // Sign in anonymously if not currently signed in
      await auth.signInAnonymously();
    }
  };

  componentWillUnmount() {}

  render() {
    return (
      <AppBar
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

export default AppBarContainer;
