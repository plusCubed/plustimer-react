// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';
import { createStore, Provider } from 'unistore/full/preact.es';

import firebase from '../utils/firebase';
import App from '../components/App';
import * as preferences from '../utils/preferences';
import * as firebaseUtils from '../utils/firebaseUtils';

const store = createStore();

type State = {
  signingIn: boolean
};

class AppContainer extends React.PureComponent<void, State> {
  state = {
    signingIn: false
  };

  unsubscribePuzzle: () => void;
  unsubscribeCategory: () => void;

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

  onAuthStateChanged = async (user: any) => {
    if (user) {
      // User is signed in.
      const { uid } = user;

      console.log('Logged In', uid);

      // Restore local Firestore to newly created account
      const localFirestore = localStorage.getItem('localFirestore');
      if (localFirestore) {
        // This will take a while, display the loading dialog
        this.setState({
          signingIn: true
        });

        const auth = await firebase.auth();
        const idToken = await auth.currentUser.getIdToken();
        const localUser = JSON.parse(localFirestore).users.local;
        const backup = {
          backup: localUser
        };
        const result = await firebaseUtils.restoreBackup(idToken, backup);
        console.log('Local -> Remote', result);
        localStorage.removeItem('localFirestore');
      }

      // Get user doc & WCA profile
      const firestore = await firebase.firestore(true);
      const userDoc = await firebaseUtils.getDoc(
        firestore.collection('users').doc(uid)
      );

      const wcaProfile = userDoc.data().wca;

      store.setState({ uid: uid, wcaProfile: wcaProfile });

      this.setState({
        signingIn: false
      });
    } else {
      // Signed out - local
      store.setState({ uid: 'local', wcaProfile: null });
    }

    this.unsubscribePuzzle && this.unsubscribePuzzle();
    this.unsubscribePuzzle = preferences.onChange(true, 'puzzle', puzzle => {
      store.setState({ puzzle: puzzle });

      this.unsubscribeCategory && this.unsubscribeCategory();
      this.unsubscribeCategory = preferences.onChange(
        true,
        'category',
        categories => {
          store.setState({ category: JSON.parse(categories)[puzzle] });
        }
      );
    });
  };

  componentWillUnmount() {}

  render() {
    return (
      <Provider store={store}>
        <App signingIn={this.state.signingIn} />
      </Provider>
    );
  }
}

export default AppContainer;
