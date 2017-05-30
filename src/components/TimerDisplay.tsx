import * as React from 'react';
import {formatTime} from '../utils/Util';
import {TimerState} from '../reducers/timer';
import './TimerDisplay.css';

export interface Props {
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onKeyUp: (e: KeyboardEvent) => void;
    displayTime: number;
}

class TimerDisplay extends React.Component<Props, TimerState> {

    componentDidMount(): void {
        window.addEventListener('keydown', this.props.onKeyDown);
        window.addEventListener('keyup', this.props.onKeyUp);
    }

    componentWillUnmount(): void {
        window.removeEventListener('keydown', this.props.onKeyDown);
        window.removeEventListener('keyup', this.props.onKeyUp);
    }

    render() {
        const {
            onTouchStart,
            onTouchEnd,
            displayTime
        } = this.props;

        return (
            <div className="timer"
                 onTouchStart={onTouchStart}
                 onTouchEnd={onTouchEnd}>
                {formatTime(displayTime)}
            </div>
        );
    }
}

export default TimerDisplay;