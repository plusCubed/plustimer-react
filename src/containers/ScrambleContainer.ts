import {
  DispatchProps,
  Scramble,
  StoreStateProps
} from '../components/Scramble';
import { Action, StoreState } from '../reducers/index';
import { connect, Dispatch } from 'react-redux';

const mapStateToProps = (state: StoreState): StoreStateProps => {
  return {
    scramble: !!state.scramble.currentScramble
      ? state.scramble.currentScramble
      : 'Scrambling'
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {};
};

export const ScrambleContainer = connect(mapStateToProps, mapDispatchToProps)(
  Scramble
);
