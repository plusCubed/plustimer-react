// @flow

import firebase from './firebase';

const DEBUG = process.env.FIREBASE_ENV === 'development';
const functionsUrl = DEBUG
  ? `http://localhost:5001/${firebase.app().options.projectId}/us-central1`
  : `https://us-central1-${
      firebase.app().options.projectId
    }.cloudfunctions.net`;

export const getCurrentPuzzleCategory = async uid => {
  const firestore = await firebase.firestore();

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

export const onPuzzleCategoryChanged = async (callback, uid) => {
  (async () => {
    const firestore = await firebase.firestore();

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

export const getBackup = () =>
  fetch(`${functionsUrl}/backup`).then(r => r.json());

export const restoreBackup = backup =>
  fetch(`${functionsUrl}/restore`, {
    method: 'POST',
    body: backup
  }).then(r => r.text());
