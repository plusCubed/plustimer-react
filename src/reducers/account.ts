import { Action } from '../utils/Util';
import { ProfileSession } from '../services/account-service';

export const LOGIN = 'ACCOUNT/LOGIN';
export const LOGIN_SUCCESS = 'ACCOUNT/LOGIN_SUCCESS';

export const login = (): Action => ({
  type: LOGIN
});

export const loginSuccess = (session: ProfileSession): Action => ({
  type: LOGIN_SUCCESS,
  payload: session
});

export interface AccountStoreState {
  session?: ProfileSession;
}

const initialStoreState: AccountStoreState = {
  session: undefined
};

export const accountReducer = (state = initialStoreState, action: Action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        session: action.payload
      };
    default:
      return state;
  }
};
