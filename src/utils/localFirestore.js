// @flow

import mitt from 'mitt';

import deep from './objectPath';

function newId(): string {
  // Alphanumeric characters
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}

const mittListeners = Object.create(null);
const emitter = mitt(mittListeners);

const getFirestore = () => {
  const firestoreString = localStorage.getItem('localFirestore');
  return !firestoreString ? {} : JSON.parse(firestoreString);
};

class Query {
  path = '';
  orderParam: [string, string] = null; //field,direction
  limitParam: number = -1;

  constructor(path) {
    this.path = path;
  }

  orderBy(fieldPath: string, directionStr: string) {
    this.orderParam = [fieldPath, directionStr || 'asc'];
    return this;
  }

  limit(limit: number) {
    this.limitParam = limit;
    return this;
  }

  async get(): QuerySnapshot {
    const firestore = getFirestore();
    let collection = deep(firestore, `${this.path}`);

    let snapshots = [];

    if (collection) {
      snapshots = Object.entries(collection)
        .slice(0, this.limitParam !== -1 ? this.limitParam : undefined)
        .filter(([key, value]) => key !== '_doc')
        .map(([key, value]) => {
          const ref = new DocumentReference(`${this.path}/${key}`);
          return new DocumentSnapshot(value['_doc'], ref);
        });

      if (this.orderParam) {
        snapshots.sort((a: DocumentSnapshot, b: DocumentSnapshot) => {
          const left = a.get(this.orderParam[0]);
          const right = b.get(this.orderParam[0]);
          if (left < right) return -1;
          if (left > right) return 1;
          return 0;
        });

        if (this.orderParam[1] === 'desc') {
          snapshots.reverse();
        }
      }
    }

    return new QuerySnapshot(snapshots, this);
  }

  onSnapshot(callback: (snapshot: QuerySnapshot) => void): () => void {
    // Register handler that returns a snapshot with this query's params
    const handler = () => {
      this.get().then(snapshot => callback(snapshot));
    };
    emitter.on(this.path, handler);

    // Initial snapshot
    handler();

    return () => {
      emitter.off(this.path, handler);
    };
  }
}

class CollectionReference extends Query {
  doc(docId) {
    return new DocumentReference(`${this.path}/${docId}`);
  }

  async add(data): DocumentReference {
    const id = newId();

    const docRef = new DocumentReference(`${this.path}/${id}`);
    await docRef.set(data);

    emitter.emit(this.path);

    return docRef;
  }
}

class DocumentReference {
  id = '';
  path = '';

  constructor(path) {
    this.path = path;

    const pathSegments = this.path.split('/');
    this.id = pathSegments[pathSegments.length - 1];
  }

  collection(collectionId) {
    return new CollectionReference(`${this.path}/${collectionId}`);
  }

  async set(data, options) {
    const oldFirestore = getFirestore();

    const oldData = (await this.get()).data();
    let newData = data;
    if (options && options.merge) {
      newData = {
        ...oldData,
        ...data
      };
    }

    const newFirestore = deep(oldFirestore, `${this.path}/_doc`, newData);
    localStorage.setItem('localFirestore', JSON.stringify(newFirestore));

    // Emit new snapshot
    emitter.emit(this.path, this.buildSnapshot(newData));
    // Notify parent collection
    if (this.path.includes('/'))
      emitter.emit(this.path.slice(0, this.path.lastIndexOf('/')));
  }

  async get(): Promise<DocumentSnapshot> {
    const firestore = getFirestore();

    const docData = deep(firestore, `${this.path}/_doc`);

    return this.buildSnapshot(docData);
  }

  async delete() {
    const firestore = getFirestore();

    const parentPath = this.path.slice(0, this.path.lastIndexOf('/'));
    let parentData = deep(firestore, parentPath);
    delete parentData[this.id];

    localStorage.setItem('localFirestore', JSON.stringify(firestore));

    // Notify parent collection
    if (this.path.includes('/'))
      emitter.emit(this.path.slice(0, this.path.lastIndexOf('/')));

    delete mittListeners[this.path];
  }

  buildSnapshot(data) {
    return new DocumentSnapshot(data, this);
  }

  onSnapshot(callback: (snapshot: DocumentSnapshot) => void): () => void {
    emitter.on(this.path, callback);

    // Initial snapshot
    this.get().then(snapshot => callback(snapshot));

    return () => {
      emitter.off(this.path, callback);
    };
  }
}

class DocumentSnapshot {
  path: string;
  docData: any;
  id: string;
  ref: DocumentReference;
  exists: boolean;
  metadata: SnapshotMetadata;

  constructor(data, ref: DocumentReference) {
    this.path = ref.path;
    this.docData = data;
    this.id = ref.id;
    this.ref = ref;
    this.exists = !!data;
    this.metadata = { fromCache: false, hasPendingWrites: false };
  }

  data() {
    return this.docData;
  }

  get(path) {
    return deep(this.docData, path);
  }
}

class QuerySnapshot {
  docs: DocumentSnapshot[];
  query: Query;

  constructor(snapshots: DocumentSnapshot[], query: Query) {
    this.docs = snapshots;
    this.query = query;
  }

  forEach(callback: (result: DocumentSnapshot) => void) {
    return this.docs.forEach(callback);
  }
}

const localFirestore = {
  collection(id: string) {
    return new CollectionReference(id);
  },
  doc(id: string) {
    return new DocumentReference(id);
  },
  enablePersistence() {}
};

export default () => localFirestore;
