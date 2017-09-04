import { NOT_ENOUGH_SOLVES } from '../reducers/docsReducer';

export interface TimeParts {
  secString: string;
  decimals: string;
}

export function timeParts(time: number): TimeParts {
  // Each entry is [minimum number of digits if not first, separator before, value]
  let hours: number = Math.floor(time / (60 * 60 * 1000));
  let minutes: number = Math.floor(time / (60 * 1000)) % 60;
  let seconds: number = Math.floor(time / 1000) % 60;

  /**
     * @param {number} num
     * @param {number} numDigitsAfterPadding
     */
  function pad(num: number, numDigitsAfterPadding: number): string {
    let output: string = '' + num;
    while (output.length < numDigitsAfterPadding) {
      output = '0' + output;
    }
    return output;
  }

  let secString: string;
  if (hours > 0) {
    secString =
      '' + pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
  } else if (minutes > 0) {
    secString = '' + minutes + ':' + pad(seconds, 2);
  } else {
    secString = '' + seconds;
  }

  let centiseconds: number = Math.floor((time % 1000) / 10);

  return {
    secString: secString,
    decimals: '' + pad(centiseconds, 2)
  };
}

export function formatTime(time: number): string {
  if (time === null || time === NOT_ENOUGH_SOLVES) {
    return '--';
  }

  let parts = timeParts(time);
  return parts.secString + '.' + parts.decimals;
}

export function mean(arr: number[]): number {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total / arr.length;
}
