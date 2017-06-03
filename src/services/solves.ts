import {Observable, Subscriber} from 'rxjs/Rx';

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
    private solves: Array<Solve>;
    private onDatabaseChange = (change: any) => {
        let index = SolvesService.findIndex(this.solves, change.doc);
        let solve = this.solves[index];

        if (change.deleted) {
            if (solve) {
                this.solves.splice(index, 1); // delete
            }
        } else {
            if (solve && solve._id === change.id) {
                this.solves[index] = change.doc; // update
            } else {
                this.solves.push(change.doc); // insert
            }
        }
    };

    static findIndex(array: Array<any>, item: any) {
        let low = 0, high = array.length, mid;
        while (low < high) {
            mid = (low + high) >>> 1;
            array[mid] < item ? low = mid + 1 : high = mid;
        }
        return low;
    }

    initDB(): Observable<any> {
        return Observable.create((subscriber: Subscriber<any>) => {
            if (!this.db) {
                /*PouchDB.plugin(cordovaSqlitePlugin);
                if (this.platform.is('cordova')) {
                  this.db = new PouchDB('solves.db', {adapter: 'cordova-sqlite'});
                 } else {*/
                this.db = new PouchDB('solves.db');
                /*}*/
            }
            subscriber.complete();
        });
    }

    getLast() {
        return this.solves[this.solves.length - 1];
    }

    add(solve: Solve) {
        return this.db.post(solve);
    }

    getAll(): Observable<Array<Solve>> {
        return Observable.of(this.solves)
            .filter(solves => !!solves)
            .concat(
                this.initDB()
                    .flatMap(() => Observable.fromPromise(this.db.allDocs({include_docs: true})))
                    .flatMap((docs: PouchDB.Core.AllDocsResponse<any>) => {
                        this.solves = docs.rows.map(row => {
                            return row.doc;
                        });

                        return Observable.of(this.solves);
                    })
                    .concat(this.getChanges()
                        .map(change => {
                            this.onDatabaseChange(change);
                            return this.solves;
                        })
                    )
            ).map(array => this.solves.sort((a: Solve, b: Solve) => {
                return a.timestamp - b.timestamp;
            })).map(array => array.slice());
    }

    getChanges(): Observable<any> {
        return Observable.create((observer: any) => {
            // Listen for changes on the database.
            this.db.changes({live: true, since: 'now', include_docs: true})
                .on('change', (change: any) => {
                    observer.next(change);
                });
        });
    }
}


