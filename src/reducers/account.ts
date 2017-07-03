import { Action } from '../utils/Util';

export const SIGN_IN = 'AVATAR/SIGN_IN';

export const signIn = (): Action => ({
  type: SIGN_IN
});

export interface AccountStoreState {
  signedIn: boolean;
}

const initialStoreState: AccountStoreState = {
  signedIn: false
};

export const accountReducer = (state = initialStoreState, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
