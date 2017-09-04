import { connect, Dispatch } from 'react-redux';
import TimerAppBar, {
  DispatchProps,
  StoreStateProps
} from '../components/TimerAppBar';
import { Action, StoreState } from '../reducers/index';
import { login } from '../reducers/accountReducer';

import noProfileImg from '../assets/temp_avatar.png';
import {
  getCategories,
  getCurrentCategoryIndex,
  getCurrentPuzzleIndex,
  getPuzzleNames,
  selectCategory,
  selectPuzzle
} from '../reducers/docsReducer';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  let avatarAltName = undefined;
  let avatarImg = undefined;

  const loggedIn = !!state.account.session;

  if (state.account.session) {
    avatarAltName = state.account.session.profile.displayName;

    if (state.account.session.profile.photos) {
      avatarImg = state.account.session.profile.photos[0].value;
    } else {
      avatarImg = noProfileImg;
    }
  } else {
    avatarImg = undefined;
    avatarAltName = undefined;
  }

  return {
    loggedIn: loggedIn,
    puzzles: getPuzzleNames(state),
    categories: getCategories(state),
    selectedPuzzle: getCurrentPuzzleIndex(state),
    selectedCategory: getCurrentCategoryIndex(state),
    avatarAltName: avatarAltName,
    avatarImg: avatarImg
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    onLoginClick: () => {
      dispatch(login());
    },
    onAvatarClick: () => {},
    onPuzzleSelected: e => {
      dispatch(selectPuzzle(e.selectedIndex));
    },
    onCategorySelected: e => {
      dispatch(selectCategory(e.selectedIndex));
    }
  };
};

export const TimerAppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerAppBar);
