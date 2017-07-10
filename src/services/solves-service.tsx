import * as PouchDB from 'pouchdb';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

export interface Doc {
  readonly _id: string;
  readonly _rev: string;
}

export class Solve implements Doc {
  readonly _id: string;
  readonly _rev: string;
  readonly type: string;

  readonly puzzleId: string;
  readonly category: string;
  readonly time: number;
  readonly timestamp: number;
  readonly scramble: string;

  constructor(
    puzzleId: string,
    category: string,
    time: number,
    timestamp: number,
    scramble: string
  ) {
    const puzzleIdClean = puzzleId.replace('puzzle-', '');
    this._id = `solve-${puzzleIdClean}-${category}-${timestamp}`;
    this._rev = '';

    this.puzzleId = puzzleId;
    this.category = category;
    this.time = time;
    this.timestamp = timestamp;
    this.scramble = scramble;
  }
}

export class Puzzle implements Doc {
  readonly _id: string;
  readonly _rev: string;

  readonly name: string;
  readonly scrambler: string;
  readonly categories: string[];

  constructor(name: string, categories: string[]) {
    this._id = `puzzle-${encodeURIComponent(name)}`;
    this._rev = '';

    this.name = name;
    this.scrambler = '';
    this.categories = categories;
  }
}

export class Config implements Doc {
  readonly _id: string;
  readonly _rev: string;

  readonly currentPuzzleId: string;
  readonly currentCategory: string;

  constructor(currentPuzzle: string, currentCategory: string) {
    this._id = 'config';
    this._rev = '';

    this.currentPuzzleId = currentPuzzle;
    this.currentCategory = currentCategory;
  }
}

export class SolvesService {
  private db: PouchDB.Database<Doc>;

  /*
  Initializes the database. Returns observable that emits an item.
   */
  initDB(): Observable<any> {
    return Observable.create((subscriber: Subscriber<PouchDB.Database>) => {
      if (!this.db) {
        this.db = new (PouchDB as any)('solves.db');
        (window as any).PouchDB = PouchDB;
      }
      subscriber.next(this.db);
      subscriber.complete();
    })
      .flatMap(() => this.initializePuzzlesIfNeeded())
      .flatMap(() => this.initializeConfigIfNeeded());
  }

  //TODO: Call initDB first
  startSync(url: string) {
    this.db.sync(url, {
      live: true,
      retry: true
    });
  }

  //TODO: Call initDB first
  add(solve: Solve) {
    return this.db.put(solve);
  }

  setConfig(config: Config) {
    if (!config._rev) {
      throw 'Configuration object must have valid _rev!';
    }
    return this.db.put(config);
  }

  getAllDocs(): Observable<Array<Doc>> {
    return this.initDB()
      .flatMap(() =>
        Observable.fromPromise(this.db.allDocs({ include_docs: true }))
      )
      .map((docs: PouchDB.Core.AllDocsResponse<Doc>) =>
        docs.rows.map(row => {
          //include_docs is used, override null warning
          return row.doc!;
        })
      );
  }

  getChanges(): Observable<PouchDB.Core.ChangesResponseChange<Doc>> {
    return this.initDB().flatMap(() =>
      Observable.create(
        (observer: Observer<PouchDB.Core.ChangesResponseChange<Doc>>) => {
          // Listen for changes on the database.
          this.db
            .changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change: PouchDB.Core.ChangesResponseChange<Doc>) => {
              observer.next(change);
            });
        }
      )
    );
  }

  private initializeConfigIfNeeded() {
    return Observable.fromPromise(
      this.db.get('config')
    ).catch((err: PouchDB.Core.Error) => {
      if (err.status === 404) {
        const defaultConfig: Config = new Config('puzzle-333', 'Normal');
        return Observable.fromPromise(this.db.put(defaultConfig));
      } else {
        return Observable.of(err);
      }
    });
  }

  private initializePuzzlesIfNeeded() {
    return Observable.fromPromise(
      this.db.get('puzzle-333')
    ).catch((err: PouchDB.Core.Error) => {
      //333 doesn't exist, initialize database
      if (err.status === 404) {
        return this.initializePuzzles();
      } else {
        return Observable.of(err);
      }
    });
  }

  initializePuzzles() {
    const defaultPuzzles: Puzzle[] = [
      {
        _id: 'puzzle-333',
        _rev: '',
        name: '3x3x3',
        scrambler: '333',
        categories: ['Normal', 'OH', 'Feet']
      },
      {
        _id: 'puzzle-444',
        _rev: '',
        name: '4x4x4',
        scrambler: '444',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-555',
        _rev: '',
        name: '5x5x5',
        scrambler: '555',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-222',
        _rev: '',
        name: '2x2x2',
        scrambler: '222',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-333bf',
        _rev: '',
        name: '3x3x3 BLD',
        scrambler: '333bf',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-333fm',
        _rev: '',
        name: '3x3x3 FMC',
        scrambler: '333fm',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-minx',
        _rev: '',
        name: 'Megaminx',
        scrambler: 'minx',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-pyram',
        _rev: '',
        name: 'Pyraminx',
        scrambler: 'pyram',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-sq1',
        _rev: '',
        name: 'Square-1',
        scrambler: 'sq1',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-clock',
        _rev: '',
        name: 'Clock',
        scrambler: 'clock',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-skewb',
        _rev: '',
        name: 'Skewb',
        scrambler: 'skweb',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-666',
        _rev: '',
        name: '6x6x6',
        scrambler: '666',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-777',
        _rev: '',
        name: '7x7x7',
        scrambler: '777',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-444bf',
        _rev: '',
        name: '4x4x4 BLD',
        scrambler: '333',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-555bf',
        _rev: '',
        name: '5x5x5 BLD',
        scrambler: '555bf',
        categories: ['Normal']
      },
      {
        _id: 'puzzle-333mbf',
        _rev: '',
        name: '3x3x3 MBLD',
        scrambler: '333mbf',
        categories: ['Normal']
      }
    ];

    return Observable.fromPromise(this.db.bulkDocs(defaultPuzzles));
  }
}
