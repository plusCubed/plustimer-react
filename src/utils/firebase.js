// @flow

import firebase from '@firebase/app';

// Put Firebase config object in firebaseConfig.js
import config from './firebaseConfig';
import debugConfig from './firebaseConfigDebug';

import localFirestore from './localFirestore';

if (process.env.NODE_ENV === 'production') firebase.initializeApp(config);
else firebase.initializeApp(debugConfig);

// May not be initialized
const app = () => firebase.app();

const firestoreAsync = async () => {
  await import('@firebase/firestore');
  return firebase.firestore();
};
const authAsync = async () => {
  await import('@firebase/auth');
  return firebase.auth();
};

const localFirestoreAsync = async () => localFirestore();

export default {
  app: app,
  auth: authAsync,
  firestore: async (uid: string | boolean): Promise<FirebaseFirestore> => {
    return uid && uid !== 'local' ? firestoreAsync() : localFirestoreAsync();
  }
};
