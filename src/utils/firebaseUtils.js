// @flow

import firebase from './firebase';

const DEBUG = process.env.FIREBASE_ENV === 'development';
const projectId = firebase.app().options.projectId;
const functionsUrl = DEBUG
  ? `http://localhost:5001/${projectId}/us-central1`
  : `https://us-central1-${projectId}.cloudfunctions.net`;

export const getCurrentPuzzleCategory = async uid => {
  const firestore = await firebase.firestore(uid);

  const userDoc = await firestore
    .collection('users')
    .doc(uid)
    .get();
  if (!userDoc.get('currentPuzzle')) {
    return [null, null];
  }

  const currentPuzzle = userDoc.get('currentPuzzle');
  const puzzleDoc = await userDoc.ref
    .collection('puzzles')
    .doc(currentPuzzle)
    .get();
  if (!puzzleDoc.get('currentCategory')) {
    return [currentPuzzle, null];
  }

  const currentCategory = puzzleDoc.get('currentCategory');
  return [currentPuzzle, currentCategory];
};

export const onPuzzleCategoryChanged = (uid, callback) => {
  (async () => {
    const firestore = await firebase.firestore(uid);

    const unsubscribeUser = firestore
      .collection('users')
      .doc(uid)
      .onSnapshot(userDoc => {
        if (!userDoc.exists || !userDoc.get('currentPuzzle')) {
          return;
        }
        const currentPuzzle = userDoc.get('currentPuzzle');
        const unsubscribePuzzle = userDoc.ref
          .collection('puzzles')
          .doc(currentPuzzle)
          .onSnapshot(puzzleDoc => {
            if (!puzzleDoc.exists || !puzzleDoc.get('currentCategory')) {
              return;
            }
            const currentCategory = puzzleDoc.get('currentCategory');

            const unsubscribe = () => {
              unsubscribeUser();
              unsubscribePuzzle();
            };

            callback(currentPuzzle, currentCategory, unsubscribe);
          });
      });
  })();
};

export const getBackup = idToken =>
  fetch(`${functionsUrl}/backup?idToken=${idToken}`).then(r => r.json());

export const restoreBackup = (idToken, backup) =>
  fetch(`${functionsUrl}/restore?idToken=${idToken}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(backup)
  }).then(r => r.text());
