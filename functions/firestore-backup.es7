// OBJECT PATH ACCESS

export function deep(obj, path, value) {
  if (arguments.length === 3) return set.apply(null, arguments);
  return get.apply(null, arguments);
}

export function get(obj, path) {
  var keys = Array.isArray(path) ? path : path.split('/');
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!obj || !Object.prototype.hasOwnProperty.call(obj, key)) {
      obj = undefined;
      break;
    }
    obj = obj[key];
  }
  return obj;
}

export function set(obj, path, value) {
  var keys = Array.isArray(path) ? path : path.split('/');
  let itObj = obj;
  for (var i = 0; i < keys.length - 1; i++) {
    var key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(itObj, key)) itObj[key] = {};
    itObj = itObj[key];
  }
  itObj[keys[i]] = value;
  return obj;
}

// FIRESTORE BACKUP / RESTORE

export const backupDocument = async (docRef, path, backup = {}) => {
  // console.log(`Backing up Document '${path}'`);

  const docSnapshot = await docRef.get();
  const docData = docSnapshot.data();

  let newBackup = deep(backup, path + '/_doc', docData);

  const collections = await docRef.getCollections();

  for (const collectionRef of collections) {
    // eslint-disable-next-line no-use-before-define
    newBackup = await backupCollection(
      collectionRef,
      path + '/' + collectionRef.id,
      newBackup
    );
  }

  return newBackup;
};

export const backupCollection = async (collectionRef, path, backup = {}) => {
  // console.log(`Backing up Collection '${path}'`);

  const collectionSnapshot = await collectionRef.get();

  let newBackup = backup;

  for (const docSnapshot of collectionSnapshot.docs) {
    // eslint-disable-next-line no-await-in-loop
    newBackup = await backupDocument(
      docSnapshot.ref,
      path + '/' + docSnapshot.id,
      newBackup
    );
  }

  return newBackup;
};

/**
 * @param docRef Destination document to restore to
 * @param path Path in the backup
 * @param backup Backup data
 * @param batch Write batch
 * @param overwrite Overwrite/merge with existing documents
 * @returns {Promise<void>}
 */
export const restoreDocument = async (
  docRef,
  path,
  backup,
  batch,
  overwrite
) => {
  // console.log(`Restoring Document '${path}'`);

  const docBackup = deep(backup, path);

  const docData = deep(backup, path + '/_doc');

  delete docBackup['_doc'];
  const collections = docBackup;

  const docExists = (await docRef.get()).exists;
  if (overwrite || !docExists) batch.set(docRef, docData, { merge: true });

  for (const collectionId of Object.keys(collections)) {
    // eslint-disable-next-line no-use-before-define,no-await-in-loop
    await restoreCollection(
      docRef.collection(collectionId),
      path + '/' + collectionId,
      backup,
      batch,
      overwrite
    );
  }
};

/**
 * @param collectionRef Destination collection to restore to
 * @param path Path in the backup
 * @param backup Backup data
 * @param batch Write batch
 * @param overwrite Overwrite/merge with existing documents
 * @returns {Promise<void>}
 */
export const restoreCollection = async (
  collectionRef,
  path,
  backup,
  batch,
  overwrite
) => {
  // console.log(`Restoring Collection '${path}'`);

  const collection = deep(backup, path);
  for (const docId of Object.keys(collection)) {
    // eslint-disable-next-line no-await-in-loop
    await restoreDocument(
      collectionRef.doc(docId),
      path + '/' + docId,
      backup,
      batch,
      overwrite
    );
  }
};
