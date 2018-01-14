// @flow

import firebase from './firebase';

const DEBUG = process.env.FIREBASE_ENV === 'development';
const projectId = firebase.app().options.projectId;
const functionsUrl = DEBUG
  ? `http://localhost:5001/${projectId}/us-central1`
  : `https://us-central1-${projectId}.cloudfunctions.net`;

export const getBackup = (idToken: string): Promise<any> =>
  fetch(`${functionsUrl}/backup?idToken=${idToken}`).then(r => r.json());

export const restoreBackup = (
  idToken: string,
  backup: { backup: any }
): Promise<string> => {
  const fetchUrl = `${functionsUrl}/restore?idToken=${idToken}`;
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(backup)
  };
  return fetch(fetchUrl, fetchOptions).then(r => r.text());
};

/**
 * Gets document snapshot from cache/network
 */
export const getDoc = (
  doc: DocumentReference,
  network?: boolean
): Promise<DocumentSnapshot> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = doc.onSnapshot(
      (snapshot: DocumentSnapshot) => {
        if (!(network && snapshot.metadata.fromCache)) {
          unsubscribe();
          resolve(snapshot);
        }
      },
      error => {
        unsubscribe();
        reject(error);
      }
    );
  });
};
