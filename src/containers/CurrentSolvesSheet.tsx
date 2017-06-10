import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {StoreState} from '../reducers/index';
import {Action} from '../utils/Util';
import SolvesSheet, {DispatchProps, StoreStateProps} from '../components/SolvesSheet';
import {getReverseSolves} from '../reducers/solves';

const mapStateToProps = (state: StoreState): StoreStateProps => {
    return {
        solves: getReverseSolves(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
    return {};
};

const CurrentSolvesSheet = connect(
    mapStateToProps,
    mapDispatchToProps
)<{}>(SolvesSheet);

export default CurrentSolvesSheet;