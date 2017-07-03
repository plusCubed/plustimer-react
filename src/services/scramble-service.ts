import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

const ScrambleWorker = require('worker-loader?name=./static/js/scramble-worker.[hash:8].js!./scramble-worker');

export class ScrambleService {
  private worker: Worker;
  private requestedScrambles$: Subject<MessageEvent>;
  private nextCommandId = 0;

  constructor() {
    this.worker = new ScrambleWorker();

    this.requestedScrambles$ = new Subject();

    this.worker.addEventListener(
      'message',
      (e: MessageEvent) => {
        this.requestedScrambles$.next(e);
      },
      false
    );
  }

  getScramble(): Observable<string> {
    const commandId = this.nextCommandId;
    this.nextCommandId++;

    this.worker.postMessage({
      command: 'getRandomScramble',
      commandId: commandId,
      eventName: '333'
    });

    return this.requestedScrambles$
      .asObservable()
      .filter(e => e.data.commandId === commandId)
      .take(1)
      .map(e => e.data.scramble.scrambleString);
  }
}
