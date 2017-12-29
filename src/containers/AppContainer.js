// @flow

import * as React from 'react';

import firebase from '../utils/firebase';
import App from '../components/App';
import { restoreBackup } from '../utils/firebaseUtils';

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
    const firestore = await firebase.firestore(true);
    try {
      await firestore.enablePersistence();
    } catch (error) {
      console.log(error);
    }

    auth.onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = async user => {
    if (user) {
      // User is signed in.
      const { uid } = user;

      console.log('Logged In', uid);

      const localFirestore = localStorage.getItem('localFirestore');
      if (localFirestore) {
        const auth = await firebase.auth();
        const idToken = await auth.currentUser.getIdToken();
        const backup = {
          backup: JSON.parse(localFirestore).users.local
        };
        const result = await restoreBackup(idToken, backup);
        console.log('Local -> Remote', result);
        localStorage.removeItem('localFirestore');
      }

      const firestore = await firebase.firestore(true);

      const userDoc = await firestore
        .collection('users')
        .doc(uid)
        .get();

      const wcaProfile = userDoc.data().wca;
      this.setState({
        uid: uid,
        wcaProfile: wcaProfile
      });
    } else {
      // Signed out
      this.setState({
        uid: 'local',
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
