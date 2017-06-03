import * as React from 'react';
import './SolvesSheet.css';
import VirtualizedItemGrid from '../assets/virtualized-item-grid/VirtualizedItemGrid';

export interface StateProps {
    solves: Array<number>;
}

export interface DispatchProps {
    onTouchMove: (e: React.TouchEvent<HTMLElement>) => void;
}

export interface Props extends StateProps, DispatchProps {
}

const SolveDisplay = ({item}: any) => {
    return (
        <div
            className="cell"
        >
            {item}
        </div>
    );
};

const SolvesSheet = ({solves, onTouchMove}: Props) => {
    return (
        <div
            className="solves-sheet"
            onTouchMove={(e) => {

                onTouchMove(e);
            }}
        >
            <div className="container">
                <div className="solves-background">
                    <VirtualizedItemGrid
                        className="solves-grid"
                        idealItemWidth={64}
                        items={solves}
                        renderItem={SolveDisplay}
                    />
                </div>
            </div>
        </div>
    );
};

export default SolvesSheet;