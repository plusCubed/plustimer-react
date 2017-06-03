import {connect, Dispatch} from 'react-redux';
import Timer from '../components/Timer';
import {down, up} from '../reducers/timerMode';
import {StoreState} from '../reducers/index';
import {Action} from '../utils/Util';

const mapStateToProps = (state: StoreState) => {
    return {
        displayTime: state.timer.time.elapsed,
        mode: state.timer.mode
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        onTouchStart: () => {
            dispatch(down(performance.now()));
        },
        onTouchEnd: () => {
            dispatch(up(performance.now()));
        },
        onKeyDown: (e: KeyboardEvent) => {
            dispatch(down(performance.now(), e.key));
        },
        onKeyUp: (e: KeyboardEvent) => {
            dispatch(up(performance.now(), e.key));
        }
    };
};

const CurrentTimer = connect(
    mapStateToProps,
    mapDispatchToProps
)<{}>(Timer);

export default CurrentTimer;