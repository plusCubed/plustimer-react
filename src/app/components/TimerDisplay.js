// @flow

import * as React from 'react';



class TimerDisplay extends React.PureComponent<Props, {}> {
  keyPressed = true;

  componentDidMount(): void {
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (!this.keyPressed) {
          this.keyPressed = true;
          if (e.key === ' ' || this.props.mode === TimerMode.Running) {
            e.preventDefault();
            this.props.onDown();
          }
        }
      },
      { passive: false }
    );
    window.addEventListener(
      'keyup',
      (e: KeyboardEvent) => {
        if (this.keyPressed) {
          this.keyPressed = false;
          if (e.key === ' ' || this.props.mode === TimerMode.Stopped) {
            e.preventDefault();
            this.props.onUp();
          }
        }
      },
      { passive: false }
    );
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown');
    window.removeEventListener('keyup');
  }

  render() {
    const { onDown, onUp, displayTime, mode } = this.props;

    return (
      <div className={`timer ${mode}`} onTouchStart={onDown} onTouchEnd={onUp}>
        {formatTime(displayTime)}
      </div>
    );
  }
}