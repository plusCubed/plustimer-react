// @flow

import firebase from './firebase';

const DEBUG = process.env.FIREBASE_ENV === 'development';
const projectId = firebase.app().options.projectId;
const functionsUrl = DEBUG
  ? `http://localhost:5001/${projectId}/us-central1`
  : `https://us-central1-${projectId}.cloudfunctions.net`;

export const getBackup = idToken =>
  fetch(`${functionsUrl}/backup?idToken=${idToken}`).then(r => r.json());

export const restoreBackup = (idToken, backup) =>
  fetch(`${functionsUrl}/restore?idToken=${idToken}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(backup)
  }).then(r => r.text());
