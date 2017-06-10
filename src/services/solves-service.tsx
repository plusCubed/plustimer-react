import {Observable, Observer, Subscriber} from 'rxjs/Rx';
import * as PouchDB from 'pouchdb';

export class Solve {
    readonly _id: string;
    readonly time: number;
    readonly timestamp: number;
    readonly scramble: string;

    constructor(time: number, timestamp: number, scramble: string) {
        this._id = '';
        this.time = time;
        this.timestamp = timestamp;
        this.scramble = scramble;
    }
}

export class SolvesService {

    private db: any;

    initDB(): Observable<any> {
        return Observable.create((subscriber: Subscriber<any>) => {
            if (!this.db) {
                this.db = new PouchDB('solves.db');
            }
            subscriber.next(this.db);
            subscriber.complete();
        });
    }

    add(solve: Solve) {
        return this.db.post(solve);
    }

    getAll(): Observable<Array<Solve>> {
        return this.initDB()
            .flatMap(() => Observable.fromPromise(this.db.allDocs({include_docs: true})))
            .flatMap((docs: PouchDB.Core.AllDocsResponse<Solve>) => {
                return Observable.of(docs.rows.map(row => {
                    return row.doc!;
                }));
            })
            .map((array: Array<Solve>) => array.sort((a: Solve, b: Solve) => {
                return a.timestamp - b.timestamp;
            }));
    }

    getChanges(): Observable<PouchDB.Core.ChangesResponseChange<Solve>> {
        return this.initDB().flatMap(() =>
            Observable.create((observer: Observer<PouchDB.Core.ChangesResponseChange<Solve>>) => {
                // Listen for changes on the database.
                this.db.changes({live: true, since: 'now', include_docs: true})
                    .on('change', (change: PouchDB.Core.ChangesResponseChange<Solve>) => {
                        observer.next(change);
                    });
            }));
    }
}