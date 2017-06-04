import * as React from 'react';
import './SolvesSheet.css';
import VirtualizedItemGrid from '../assets/virtualized-item-grid/VirtualizedItemGrid';
import {ScrollParams} from 'react-virtualized';

export interface StoreStateProps {
    readonly solves: Array<number>;
}

export interface DispatchProps {
}

export interface Props extends StoreStateProps, DispatchProps {
}

export interface State {
    readonly offset: number;
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

enum ScrollState {
    IDLE, PANNING, SCROLLING
}

class SolvesSheet extends React.PureComponent<Props, State> {
    static collapsedY = '100% - 48px - 24px';
    static expandedY = '16px';

    private isExpanded = false;

    private isAnimating = false;
    private scrollState: ScrollState;

    private lastY = -1;
    private lastDy = 0;
    private lastTimestamp = -1;
    private isSecondTouch = false;

    private isScrolledToTop = true;
    handleScroll = (params: ScrollParams) => {
        this.isScrolledToTop = (params.scrollTop === 0);
    };
    private lastVelocity: number;
    handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
        if (this.isAnimating) {
            return;
        }

        let touchobj = e.changedTouches[0];
        const dY = touchobj.clientY - this.lastY;

        if (this.lastY === -1) {

            // Initial touch event: set baseline Y
            this.isSecondTouch = true;

        } else if (this.isSecondTouch) {

            // Second touch event: determine direction, whether to move the sheet

            if (this.scrollState !== ScrollState.SCROLLING && !this.isExpanded ||
                this.isScrolledToTop && dY > 0) {
                // this.setScrollEnabled(false);
                this.scrollState = ScrollState.PANNING;
                this.setState({offset: 0});
            }

            this.isSecondTouch = false;

        } else {

            // Later touch events: move the sheet

            if (this.scrollState === ScrollState.PANNING) {
                // this.setScrollEnabled(false);
                this.setState({offset: this.state.offset + dY});
            }

            this.lastDy = dY;
        }

        this.lastY = touchobj.clientY;
        this.lastVelocity = dY / (performance.now() - this.lastTimestamp);
        this.lastTimestamp = performance.now();
    };
    handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        if (this.isAnimating /*|| this.platform.is('core')*/) {
            return;
        }

        if (this.scrollState === ScrollState.PANNING && this.state.offset !== 0) {
            // If moving the sheet, set expanded status

            this.animateExpanded(this.lastDy < 0, this.lastVelocity);
        }

        this.scrollState = ScrollState.IDLE;

        this.lastY = -1;
        this.lastDy = 0;
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            offset: 0
        };
    }

    animateExpanded(isExpanded: boolean, velocity: number) {
        this.isExpanded = isExpanded;

        this.setState({offset: 0});
        this.isAnimating = true;
        // this.setScrollEnabled(isExpanded);

        const stiffness = 170;
        const damping = 2 * Math.sqrt(stiffness);
    }

    render() {
        const {solves} = this.props;
        const style = {
            transform: `translate3d(0, calc(${SolvesSheet.collapsedY} - ${-this.state.offset}px), 0)`
        };
        return (
            <div
                className="solves-sheet"
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                style={style}
            >
                <div className="container">
                    <div className="solves-background">
                        <VirtualizedItemGrid
                            idealItemWidth={64}
                            items={solves}
                            renderItem={SolveDisplay}
                            className="solves-grid"
                            onScroll={this.handleScroll}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default SolvesSheet;