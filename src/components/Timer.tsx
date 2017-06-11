import * as React from 'react';
import {formatTime} from '../utils/Util';
import './Timer.css';
import {TimerMode} from '../reducers/timerMode';

export interface StoreStateProps {
    readonly displayTime: number;
    readonly mode: string;
}

export interface DispatchProps {
    readonly onDown: () => void;
    readonly onUp: () => void;
}

export interface Props extends StoreStateProps, DispatchProps {
}

class TimerDisplay extends React.PureComponent<Props, {}> {

    private keyPressed: boolean;

    componentDidMount(): void {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (!this.keyPressed) {
                this.keyPressed = true;
                if (e.key === ' ' || this.props.mode === TimerMode.Running) {
                    this.props.onDown();
                }
            }
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if (this.keyPressed) {
                this.keyPressed = false;
                if (e.key === ' ' || this.props.mode === TimerMode.Stopped) {
                    this.props.onUp();
                }
            }
        });
    }

    componentWillUnmount(): void {
        window.removeEventListener('keydown');
        window.removeEventListener('keyup');
    }

    render() {
        const {
            onDown,
            onUp,
            displayTime,
            mode
        } = this.props;

        return (
            <div
                className={`timer ${mode}`}
                onTouchStart={onDown}
                onTouchEnd={onUp}
            >
                {formatTime(displayTime)}
            </div>
        );
    }
}

export default TimerDisplay;