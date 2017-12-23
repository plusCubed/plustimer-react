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
    if (process.env.NODE_ENV === 'production') {
      const auth = await firebase.auth();
      const oldIdToken = await auth.currentUser.getIdToken(true);
      window.open(
        `popup.html?oldIdToken=${oldIdToken}`,
        '_blank',
        'height=585,width=400'
      );
    } else {
      (async () => {
        const auth = await firebase.auth();
        await auth
          .createUserWithEmailAndPassword('pluscubed@gmail.com', '123456')
          .catch(error => {
            console.log(error);
          });
        await auth.signInWithEmailAndPassword('pluscubed@gmail.com', '123456');
        const firestore = await firebase.firestore();
        await firestore
          .collection('users')
          .doc(auth.currentUser.uid)
          .set({
            wca: {
              class: 'user',
              url: 'https://www.worldcubeassociation.org/persons/2013CIAO01',
              id: 5320,
              wca_id: '2013CIAO01',
              name: 'Daniel Ciao',
              gender: 'm',
              country_iso2: 'US',
              delegate_status: null,
              created_at: '2015-09-04T00:59:45.000Z',
              updated_at: '2017-12-19T20:36:57.000Z',
              teams: [],
              avatar: {
                url:
                  'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png',
                thumb_url:
                  'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png',
                is_default: true
              },
              email: 'pluscubed@gmail.com'
            }
          });
      })().then();
    }
  };

  handleAvatarClick = async () => {
    const auth = await firebase.auth();
    await auth.signOut();
    // Sign in anonymously if not currently signed in
    await auth.signInAnonymously();
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
