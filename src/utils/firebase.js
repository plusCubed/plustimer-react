// @flow

import firebase from 'firebase/app';

// Put Firebase config object in firebaseConfig.js
import config from './firebaseConfig';
import debugConfig from './firebaseConfigDebug';

if (process.env.NODE_ENV === 'production') firebase.initializeApp(config);
else firebase.initializeApp(debugConfig);

const firestoreAsync = async () => {
  await import('firebase/firestore');
  return firebase.firestore();
};
const authAsync = async () => {
  await import('firebase/auth');
  return firebase.auth();
};

export default {
  auth: authAsync,
  firestore: firestoreAsync
};
