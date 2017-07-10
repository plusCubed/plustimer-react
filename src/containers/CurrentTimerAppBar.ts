import { connect, Dispatch } from 'react-redux';
import TimerAppBar, {
  DispatchProps,
  StoreStateProps
} from '../components/TimerAppBar';
import { Action, StoreState } from '../reducers/index';
import { login } from '../reducers/account';

import noProfileImg from '../assets/temp_avatar.png';
import { getPuzzleNames } from '../reducers/solves';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    loggedIn: !!state.account.session,
    puzzles: getPuzzleNames(state),
    avatarAltName: !!state.account.session
      ? state.account.session.profile.displayName
      : undefined,
    avatarImg: !!state.account.session
      ? state.account.session.profile.photos
        ? state.account.session.profile.photos[0].value
        : noProfileImg
      : undefined
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    handleLoginClick: () => {
      dispatch(login());
    },
    handleAvatarClick: () => {}
  };
};

const CurrentTimer = connect(mapStateToProps, mapDispatchToProps)(TimerAppBar);

export default CurrentTimer;
