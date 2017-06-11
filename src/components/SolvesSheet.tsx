import * as React from 'react';
import './SolvesSheet.css';
import VirtualizedItemGrid from './virtualized-item-grid/VirtualizedItemGrid';
import {ScrollParams} from 'react-virtualized';
import {animateSpringViaCss} from '../utils/spring';
import CaretUp from 'material-ui-icons/KeyboardArrowUp';
import CaretDown from 'material-ui-icons/KeyboardArrowDown';
import {Solve} from '../services/solves-service';
import {formatTime} from '../utils/Util';

export interface StoreStateProps {
    readonly solves: Solve[];
}

export interface DispatchProps {
}

export interface Props extends StoreStateProps, DispatchProps {
}

export interface State {
    readonly isExpanded: boolean;
    readonly isAnimating: boolean;
}

const SolveDisplay = ({item}: { item: Solve }) => {
    return (
        <div className="cell">
            {formatTime(item.time)}
        </div>
    );
};

enum ScrollState {
    IDLE, PANNING, SCROLLING
}

class SolvesSheet extends React.PureComponent<Props, State> {
    static collapsedY = '100% - 48px - 24px';
    static expandedY = '0px';

    private scrollState: ScrollState;

    private lastY = -1;
    private lastDy = 0;
    private lastTimestamp = -1;
    private lastVelocity: number;
    private isSecondTouch = false;

    private isScrolledToTop = true;

    private oldTop: number;
    private animationCallback: any;

    private offset = 0;

    private solvesSheet: HTMLElement;

    private gridStyle: React.CSSProperties = {};

    constructor(props: Props) {
        super(props);
        this.state = {
            isExpanded: false,
            isAnimating: false
        };
    }

    handleScroll = (params: ScrollParams) => {
        this.isScrolledToTop = (params.scrollTop === 0);
    };

    handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
        if (this.state.isAnimating) {
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
                this.setOffset(0);
            }

            this.isSecondTouch = false;

        } else {

            // Later touch events: move the sheet

            if (this.scrollState === ScrollState.PANNING) {
                // this.setScrollEnabled(false);
                this.setOffset(this.offset + dY);
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

        if (this.scrollState === ScrollState.PANNING && this.offset !== 0) {
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

        this.setOffset(0);
        this.setState({
            isExpanded: isExpanded,
            isAnimating: true
        });
    }

    setOffset(offset: number) {
        this.offset = offset;
        this.updateDOMTransformStyle();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, prevContext: any): void {
        if (this.state.isAnimating) {
            const newTop = this.solvesSheet.getBoundingClientRect().top;

            const invert = newTop - this.oldTop;

            const mass = 50;
            const stiffness = 5;
            const damping = 2 * Math.sqrt(stiffness * mass) * 0.6;

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

    handleCaretClick = () => {
        this.animateExpanded(!this.state.isExpanded);
    };

    stopAnimation() {
        this.solvesSheet.style.cssText = '';
        this.updateDOMTransformStyle();
        this.setState({
            isAnimating: false
        });

        this.gridStyle = {overflowY: this.state.isExpanded ? 'auto' : 'hidden'};
    }

    getTransformStyle() {
        return this.state.isExpanded ?
            `translate3d(0, calc(${SolvesSheet.expandedY} - ${-this.offset}px), 0)` :
            `translate3d(0, calc(${SolvesSheet.collapsedY} - ${-this.offset}px), 0)`;
    }

    updateDOMTransformStyle() {
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
                <div
                    className="caret-icon"
                    onClick={this.handleCaretClick}
                >
                    {this.state.isExpanded ?
                        <CaretDown/> :
                        <CaretUp/>
                    }
                </div>
                <div className="container">
                    <div className="solves-background">
                        <VirtualizedItemGrid
                            style={this.gridStyle}
                            minItemWidth={64}
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