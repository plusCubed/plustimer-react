import {
  DispatchProps,
  Scramble,
  StoreStateProps
} from '../components/Scramble';
import { StoreState } from '../reducers/index';
import { connect, Dispatch } from 'react-redux';
import { Action } from '../utils/Util';

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

const CurrentScramble = connect(mapStateToProps, mapDispatchToProps)(Scramble);

export default CurrentScramble;
