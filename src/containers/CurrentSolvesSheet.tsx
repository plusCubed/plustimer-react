import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {StoreState} from '../reducers/index';
import {Action} from '../utils/Util';
import SolvesSheet, {DispatchProps, StoreStateProps} from '../components/SolvesSheet';

const solves = [
    1.45,
    2.45,
    34,
    23,
    234,
    23,
    34.2,
    34.2,
    5462,
    23, 3, 3, 4, 2, 54, 7, 2, 2, 3, 5, 7, 2, 3, 6, 78, 2, 3, 5,
    3, 3, 4, 2, 54, 7, 2, 2, 3, 5, 7, 2, 3, 6, 78, 2, 3, 5,
    3, 3, 4, 2, 54, 7, 2, 2, 3, 5, 7, 2, 3, 6, 78, 2, 3, 5
];

const mapStateToProps = (state: StoreState): StoreStateProps => {
    return {
        solves: solves
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