import mitt from 'mitt';

import ScrambleWorker from './scramble.worker';

class ScrambleService {
  worker: Worker;
  requestedScrambles;
  nextCommandId = 0;

  constructor() {
    this.worker = new ScrambleWorker();

    this.requestedScrambles = mitt();

    this.worker.addEventListener(
      'message',
      e => {
        this.requestedScrambles.emit(e.data.commandId, e);
      },
      false
    );
  }

  getScramble(scrambler: string): Promise<string> {
    const commandId = this.nextCommandId;
    this.nextCommandId++;

    const scramblePromise = new Promise(resolve => {
      const listener = e => {
        this.requestedScrambles.off(commandId, listener);
        const scramble = e.data.scramble.scrambleString.replace(/<br>/g, '\n');
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
  }
}

export default new ScrambleService();
