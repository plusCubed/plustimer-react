import {Observable, Subject} from 'rxjs/Rx';

export class ScrambleService {
    private worker: Worker;
    private requestedScrambles$: Subject<MessageEvent>;
    private nextCommandId = 0;

    constructor() {
        this.worker = new Worker('assets/scramble-worker.js');

        this.requestedScrambles$ = new Subject();

        this.worker.addEventListener(
            'message',
            (e: MessageEvent) => {
                this.requestedScrambles$.next(e);
            },
            false);
    }

    getScramble(): Observable<string> {
        const commandId = this.nextCommandId;
        this.nextCommandId++;

        this.worker.postMessage({
            command: 'getRandomScramble',
            commandId: commandId,
            eventName: '333'
        });

        return this.requestedScrambles$.asObservable()
            .filter(e => e.data.commandId === commandId)
            .take(1)
            .map(e => e.data.scramble.scrambleString);
    }

}
