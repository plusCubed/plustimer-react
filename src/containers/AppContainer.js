// @flow

import * as React from 'react';

import firebase from '../utils/firebase';
import App from '../components/App';

type State = {
  uid: string,
  wcaProfile: any
};

class AppContainer extends React.PureComponent<void, State> {
  state = {
    uid: '',
    wcaProfile: null
  };

  async componentDidMount() {
    const auth = await firebase.auth();
    const firestore = await firebase.firestore();
    try {
      await firestore.enablePersistence();
    } catch (error) {
      console.log(error);
    }

    if (!auth.currentUser) {
      // Sign in anonymously if not currently signed in
      await auth.signInAnonymously();
    }

    auth.onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = async user => {
    if (user) {
      // User is signed in.
      let { uid } = user;

      console.log('Logged In', uid);

      const firestore = await firebase.firestore();

      if (!user.isAnonymous) {
        let userDoc = await firestore
          .collection('users')
          .doc(uid)
          .get();

        const wcaProfile = userDoc.data().wca;
        this.setState({ wcaProfile: wcaProfile });
      } else {
        // If anonymous, account expires in 30 days
        await firestore
          .collection('users')
          .doc(uid)
          .set(
            { expires: Math.floor(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { merge: true }
          );
      }

      this.setState({ uid: uid });
    } else {
      // Signed out
      this.setState({
        uid: '',
        wcaProfile: null
      });
    }
  };

  componentWillUnmount() {}

  render() {
    return <App uid={this.state.uid} wcaProfile={this.state.wcaProfile} />;
  }
}

export default AppContainer;
