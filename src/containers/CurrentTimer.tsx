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
            dispatch(down());
        },
        onTouchEnd: () => {
            dispatch(up());
        },
        onKeyDown: (e: KeyboardEvent) => {
            dispatch(down(e.key));
        },
        onKeyUp: (e: KeyboardEvent) => {
            dispatch(up(e.key));
        }
    };
};

const CurrentTimer = connect(
    mapStateToProps,
    mapDispatchToProps
)<{}>(Timer);

export default CurrentTimer;