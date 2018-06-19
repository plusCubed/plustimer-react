import mitt from 'mitt';

import ScrambleWorker from 'worker-loader!./scramble.worker';

class ScrambleService {
  worker: Worker;
  requestedScrambles;
  nextCommandId = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.worker = new ScrambleWorker();

      this.requestedScrambles = new mitt();

      this.worker.addEventListener(
        'message',
        e => {
          this.requestedScrambles.emit(e.data.commandId, e);
        },
        false
      );
    }
  }

  getScramble(scrambler: string): Promise<string> {
    if (typeof window !== 'undefined') {
      const commandId = this.nextCommandId;
      this.nextCommandId++;

      const scramblePromise = new Promise<string>(resolve => {
        const listener = e => {
          this.requestedScrambles.off(commandId, listener);
          const scramble = e.data.scramble.scrambleString.replace(
            /<br>/g,
            '\n'
          );
          resolve(scramble);
        };
        this.requestedScrambles.on(commandId, listener);
      });

      this.worker.postMessage({
        command: 'getRandomScramble',
        commandId: commandId,
        eventName: scrambler
      });
      return scramblePromise;
    } else {
      return Promise.resolve(undefined);
    }
  }
}

export default new ScrambleService();
