// Uses the batch write to delete a document recursively
export async function deleteDocumentRecursive(documentRef, batch) {
  const collections = await documentRef.getCollections();
  for (const collectionRef of collections) {
    // eslint-disable-next-line no-await-in-loop,no-use-before-define
    await deleteCollectionRecursive(collectionRef, batch);
  }
  batch.delete(documentRef);
}

/**
 * Uses the batch write to delete a collection recursively
 */
export async function deleteCollectionRecursive(collectionRef, batch) {
  const collectionSnapshot = await collectionRef.get();

  for (const docSnapshot of collectionSnapshot.docs) {
    // eslint-disable-next-line no-await-in-loop
    await deleteDocumentRecursive(docSnapshot.ref, batch);
  }
}
