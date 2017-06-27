import {connect, Dispatch} from 'react-redux';
import TimerAppBar, {DispatchProps, StoreStateProps} from '../components/TimerAppBar';
import {StoreState} from '../reducers/index';
import {Action} from '../utils/Util';
import {signIn} from '../reducers/account';

const mapStateToProps = (state: StoreState): StoreStateProps => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
    return {
        handleAvatarClick: () => {
            dispatch(signIn());
        }
    };
};

const CurrentTimer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimerAppBar);

export default CurrentTimer;