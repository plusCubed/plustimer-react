import * as React from 'react';
import './SolvesSheet.css';
import VirtualizedItemGrid from '../assets/virtualized-item-grid/VirtualizedItemGrid';
import {ScrollParams} from 'react-virtualized';
import {animateSpringViaCss} from '../utils/spring';

export interface StoreStateProps {
    readonly solves: Array<number>;
}

export interface DispatchProps {
}

export interface Props extends StoreStateProps, DispatchProps {
}

export interface State {
    readonly offset: number;
    readonly isExpanded: boolean;
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
    static expandedY = '16px + 64px';

    private isAnimating = false;
    private scrollState: ScrollState;

    private lastY = -1;
    private lastDy = 0;
    private lastTimestamp = -1;
    private lastVelocity: number;
    private isSecondTouch = false;

    private isScrolledToTop = true;

    private oldTop: number;
    private animationCallback: any;

    private solvesSheet: HTMLElement;

    constructor(props: Props) {
        super(props);
        this.state = {
            offset: 0,
            isExpanded: false
        };
    }

    handleScroll = (params: ScrollParams) => {
        this.isScrolledToTop = (params.scrollTop === 0);
    };

    handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
        if (this.isAnimating) {
            this.stopAnimation();
        }

        let touchobj = e.changedTouches[0];
        const dY = touchobj.clientY - this.lastY;

        if (this.lastY === -1) {

            // Initial touch event: set baseline Y
            this.isSecondTouch = true;

        } else if (this.isSecondTouch) {

            // Second touch event: determine direction, whether to move the sheet

            if (this.scrollState !== ScrollState.SCROLLING && !this.state.isExpanded ||
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
        this.lastVelocity = dY / (performance.now() - this.lastTimestamp) * 1000;
        this.lastTimestamp = performance.now();
    };

    handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        // If touch move wasn't fired in the last 50ms, velocity is 0
        if (performance.now() - this.lastTimestamp > 50) {
            this.lastVelocity = 0;
        }

        if (this.scrollState === ScrollState.PANNING && this.state.offset !== 0) {
            // If moving the sheet, set expanded status

            this.animateExpanded(this.lastDy < 0);
        }

        this.scrollState = ScrollState.IDLE;

        this.lastY = -1;
        this.lastDy = 0;
    };

    animateExpanded(isExpanded: boolean) {
        // this.setScrollEnabled(isExpanded);

        this.oldTop = this.solvesSheet.getBoundingClientRect().top;

        this.isAnimating = true;
        this.setState({
            isExpanded: isExpanded,
            offset: 0
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, prevContext: any): void {
        if (this.isAnimating) {
            const newTop = this.solvesSheet.getBoundingClientRect().top;

            const invert = newTop - this.oldTop;

            const mass = 1;
            const stiffness = 0.05;
            const damping = 2 * Math.sqrt(stiffness * mass);

            const mapper = this.state.isExpanded ?
                (x: number) => {
                    return `transform: translate3d(0, calc(${SolvesSheet.expandedY} - ${x}px), 0)`;
                } :
                (x: number) => {
                    return `transform: translate3d(0, calc(${SolvesSheet.collapsedY} - ${x}px), 0)`;
                };

            const springAnimValues =
                animateSpringViaCss(invert, -this.lastVelocity, mass, stiffness, damping, mapper);

            this.animationCallback = springAnimValues.callback;

            requestAnimationFrame(() => {
                this.solvesSheet.style.cssText = springAnimValues.animationStyles;
            });
        }
    }

    handleAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
        if (this.animationCallback) {
            this.animationCallback();
            this.animationCallback = null;
        }

        this.stopAnimation();
    };

    stopAnimation() {
        this.isAnimating = false;
        this.resetStyle();
    }

    resetStyle() {
        this.solvesSheet.style.cssText = '';
        this.solvesSheet.style.transform = this.getTransformStyle();
    }

    render() {
        const {solves} = this.props;

        const style = {
            transform: this.getTransformStyle()
        };

        return (
            <div
                className="solves-sheet"
                ref={(solvesSheet) => this.solvesSheet = solvesSheet}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                onAnimationEnd={this.handleAnimationEnd}
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

    private getTransformStyle() {
        return this.state.isExpanded ?
            `translate3d(0, calc(${SolvesSheet.expandedY} - ${-this.state.offset}px), 0)` :
            `translate3d(0, calc(${SolvesSheet.collapsedY} - ${-this.state.offset}px), 0)`;
    }
}

export default SolvesSheet;