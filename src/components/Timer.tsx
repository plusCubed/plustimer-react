import * as React from 'react';
import {formatTime} from '../utils/Util';
import './Timer.css';

export interface StoreStateProps {
    readonly displayTime: number;
    readonly mode: string;
}

export interface DispatchProps {
    readonly onTouchStart: () => void;
    readonly onTouchEnd: () => void;
    readonly onKeyDown: (e: KeyboardEvent) => void;
    readonly onKeyUp: (e: KeyboardEvent) => void;
}

export interface Props extends StoreStateProps, DispatchProps {
}

class TimerDisplay extends React.PureComponent<Props, {}> {

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
            displayTime,
            mode
        } = this.props;

        return (
            <div
                className={`timer ${mode}`}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {formatTime(displayTime)}
            </div>
        );
    }
}

export default TimerDisplay;