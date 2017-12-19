interface TimeParts {
  secString: string;
  decimals: string;
}

export function timeParts(time: number): TimeParts {
  // Each entry is [minimum number of digits if not first, separator before, value]
  const hours: number = Math.floor(time / (60 * 60 * 1000));
  const minutes: number = Math.floor(time / (60 * 1000)) % 60;
  const seconds: number = Math.floor(time / 1000) % 60;

  /**
   * @param {number} num
   * @param {number} numDigitsAfterPadding
   */
  function pad(num: number, numDigitsAfterPadding: number): string {
    let output: string = `${num}`;
    while (output.length < numDigitsAfterPadding) {
      output = `0${output}`;
    }
    return output;
  }

  let secString: string;
  if (hours > 0) {
    secString = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
  } else if (minutes > 0) {
    secString = `${minutes}:${pad(seconds, 2)}`;
  } else {
    secString = `${seconds}`;
  }

  const centiseconds: number = Math.floor((time % 1000) / 10);

  return {
    secString,
    decimals: `${pad(centiseconds, 2)}`
  };
}

export function formatTime(time: number): string {
  if (time === null /* || time === NOT_ENOUGH_SOLVES */) {
    return '--';
  }

  const parts = timeParts(time);
  return `${parts.secString}.${parts.decimals}`;
}
