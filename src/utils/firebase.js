// @flow

import firebase from 'firebase/app';
import 'firebase/firestore';

// Put Firebase config object in firebaseConfig.js
import config from './firebaseConfig';

firebase.initializeApp(config);

export default firebase;
