import { backupDocument, restoreDocument } from './firestore-backup';
import { deleteDocumentRecursive } from './firestore-utils';

const functions = require('firebase-functions');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const simpleOAuth = require('simple-oauth2');
const rpn = require('request-promise-native');

const safeCompare = require('safe-compare');
const { PromisePool } = require('es6-promise-pool');
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;

// Cron key
const cronKey = require('./cron-key.json');

// Firebase Setup
const admin = require('firebase-admin');

const DEBUG = process.env.FIREBASE_ENV === 'development';

const OAUTH_REDIRECT_URI = DEBUG
  ? `http://localhost:5000/popup.html`
  : `https://timer.pluscubed.com/popup.html`;
const OAUTH_SCOPES = 'public email';

const wcaOAuth = DEBUG
  ? require('./wca-oauth-debug.json')
  : require('./wca-oauth.json');

const serviceAccount = DEBUG
  ? require('./service-account-debug.json')
  : require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
});

/**
 * Creates a configured simple-oauth2 client for WCA
 */
function wcaOAuth2Client() {
  const credentials = {
    client: {
      id: wcaOAuth.id,
      secret: wcaOAuth.secret
    },
    auth: {
      tokenHost: 'https://www.worldcubeassociation.org'
    }
  };
  return simpleOAuth.create(credentials);
}

/**
 * Redirects the User to the WCA authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
exports.redirect = functions.https.onRequest((req, res) => {
  const oauth2 = wcaOAuth2Client();

  cookieParser()(req, res, () => {
    let state = crypto.randomBytes(20).toString('hex');

    const oldIdToken = req.query.oldIdToken;
    if (oldIdToken) {
      console.log('Old ID token saved to state', oldIdToken);
      state = `${oldIdToken}|${state}`;
    }

    console.log('Setting verification state:', state);
    res.cookie('state', state.toString(), {
      maxAge: 3600000,
      secure: !DEBUG,
      httpOnly: true
    });
    const redirectUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: OAUTH_REDIRECT_URI,
      scope: OAUTH_SCOPES,
      state: encodeURI(state)
    });
    console.log('Redirecting to:', redirectUri);
    res.redirect(redirectUri);
  });
});

/**
 * Creates a Firebase account with the given user profile and returns a custom
 * auth token allowing signing-in this account.
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
async function createFirebaseAccount(wcaProfile, accessToken, idToken) {
  // The UID we'll assign to the user.
  const wcaUid = `wca:${wcaProfile.id}`;

  if (idToken) {
    console.log('Old ID token found in state', idToken);

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const anonUid = decodedToken.uid;

    const anonUserDocRef = await admin
      .firestore()
      .collection('users')
      .doc(anonUid);

    const backup = await backupDocument(anonUserDocRef, `users/${anonUid}`);

    console.log('Backup Completed', JSON.stringify(backup));

    const wcaUserDocRef = admin
      .firestore()
      .collection('users')
      .doc(wcaUid);
    const batch = admin.firestore().batch();
    await restoreDocument(
      wcaUserDocRef,
      `users/${anonUid}`,
      backup,
      batch,
      false
    );

    console.log('Backup Restored');

    await deleteDocumentRecursive(anonUserDocRef, batch);

    await batch.commit().catch(error => console.log(error));

    // Save the profile
    // Overwrite all (e.g. restored 'expires' field)
    await wcaUserDocRef.set({ wca: wcaProfile });
    await admin.auth().deleteUser(anonUid);
  }

  // Create or update the user account.
  try {
    await admin.auth().updateUser(wcaUid, {
      email: wcaProfile.email
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      await admin.auth().createUser({
        uid: wcaUid,
        email: wcaProfile.email
      });
    }
  }

  // Create a Firebase custom auth token.
  const token = await admin.auth().createCustomToken(wcaUid);

  console.log(`Created Custom token for UID "${wcaUid}" Token: ${token}`);

  return token;
}

/**
 * Exchanges a given WCA auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
 * 'callback' query parameter.
 */
exports.token = functions.https.onRequest((req, res) => {
  console.log('DEBUG', DEBUG);

  const oauth2 = wcaOAuth2Client();

  cookieParser()(req, res, async () => {
    try {
      console.log('Received verification state:', req.cookies.state);
      const queryState = decodeURI(req.query.state);
      console.log('Received state:', queryState);

      if (!req.cookies.state) {
        throw new Error(
          'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
        );
      } else if (req.cookies.state !== queryState) {
        throw new Error('State validation failed');
      }

      console.log('Received auth code:', req.query.code);

      const results = await oauth2.authorizationCode.getToken({
        code: req.query.code,
        redirect_uri: OAUTH_REDIRECT_URI
      });

      console.log(
        'Auth code exchange result received:',
        JSON.stringify(results).replace('\n', '')
      );

      // We have an WCA access token now.
      const accessToken = results.access_token;

      const options = {
        uri: 'https://www.worldcubeassociation.org/api/v0/me',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        json: true // Automatically parses the JSON string in the response
      };

      const wcaResponse = await rpn(options);

      console.log('WCA Profile received: ', wcaResponse.me.id);

      /* Example:
      {
        class: 'user',
        url: 'https://www.worldcubeassociation.org/persons/2013CIAO01',
        id: 5320,
        wca_id: '2013CIAO01',
        name: 'Daniel Ciao',
        gender: 'm',
        country_iso2: 'US',
        delegate_status: null,
        created_at: '2015-09-04T00:59:45.000Z',
        updated_at: '2017-12-19T20:36:57.000Z',
        teams: [],
        avatar:
         { url: 'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png',
           thumb_url: 'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png',
           is_default: true },
        email: 'pluscubed@gmail.com'
      }
      */

      let idToken;
      if (queryState.includes('|')) {
        idToken = queryState.split('|')[0];
      }

      // Create a Firebase account and get the Custom Auth Token.
      const firebaseToken = await createFirebaseAccount(
        wcaResponse.me,
        accessToken,
        idToken
      );

      // Serve an HTML page that signs the user in and updates the user profile.
      res.jsonp({ token: firebaseToken });
    } catch (error) {
      console.error(error);
      res.jsonp({ error: error.toString() });
    }
  });
});

async function getUsers(users = [], nextPageToken) {
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  if (listUsersResult.pageToken) {
    // List next batch of users.
    return getUsers(
      users.concat(listUsersResult.users),
      listUsersResult.pageToken
    );
  }
  return users.concat(listUsersResult.users);
}

exports.accountcleanup = functions.https.onRequest(async (req, res) => {
  const key = req.query.key;

  // Exit if the keys don't match
  if (!safeCompare(key, cronKey)) {
    console.log(
      'The key provided in the request does not match the key set in the environment. Check that',
      key,
      'matches cron-key.json`'
    );
    res
      .status(403)
      .send(
        'Security key does not match. Make sure your "key" URL query parameter matches cron-key.json'
      );
    return;
  }

  // Fetch all user details.
  const users = await getUsers();

  let deleted = 0;

  const usersToDelete = users.slice(0);

  // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
  const promiseProducer = async () => {
    if (usersToDelete.length > 0) {
      const user = usersToDelete.pop();

      console.log('Checking', user.uid);

      const userDocRef = admin
        .firestore()
        .collection('users')
        .doc(user.uid);

      const userDoc = await userDocRef
        .get()
        .catch(error => console.error(error));

      if (
        !userDoc.exists ||
        (userDoc.data().expires && userDoc.data().expires < Date.now())
      ) {
        // Delete the inactive user.
        await admin
          .auth()
          .deleteUser(user.uid)
          .catch(error => {
            console.error(
              'Deletion of inactive user account',
              user.uid,
              'failed:',
              error
            );
          });
        console.log('Deleted user account', user.uid, 'because of inactivity');

        deleted += 1;
      }

      if (
        userDoc.exists &&
        (userDoc.data().expires && userDoc.data().expires < Date.now())
      ) {
        const batch = admin.firestore().batch();
        deleteDocumentRecursive(userDocRef, batch);
        await batch.commit().catch(error => {
          console.error(
            'Deletion of inactive user document',
            user.uid,
            'failed:',
            error
          );
        });
        console.log('Deleted user document', user.uid, 'because of inactivity');
      }
    }
  };
  const promisePool = new PromisePool(promiseProducer, MAX_CONCURRENT);

  promisePool.start().then(() => {
    const message = `User cleanup finished, deleted ${deleted} users`;
    console.log(message);
    res.send(message);
  });
});
