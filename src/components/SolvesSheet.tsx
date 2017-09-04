import * as React from 'react';

import './SolvesSheet.css';

import { Solve } from '../services/solvesService';
import { formatTime } from '../utils/util';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { Grid } from 'react-virtualized/dist/es/Grid';

import IconToggle from 'preact-material-components/IconToggle';
import Button from 'preact-material-components/Button';
import 'preact-material-components/IconToggle/style.css';
import 'preact-material-components/Button/style.css';

import { Icon } from './Icon';
import { GridCellProps, GridProps } from 'react-virtualized';

export interface StoreStateProps {
  readonly solves: Solve[];
}

export interface DispatchProps {
  readonly onCellClicked: (solve: Solve) => void;
}

export interface Props extends StoreStateProps, DispatchProps {}

export interface State {
  readonly isExpanded: boolean;
  readonly isAnimating: boolean;
}

const CaretDownIcon = (props: any) => (
  <Icon>
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
  </Icon>
);

const CaretUpIcon = (props: any) => (
  <Icon>
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </Icon>
);

class SolvesSheet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false,
      isAnimating: false
    };
  }

  renderCell = ({ columnIndex, key, style }: GridCellProps) => {
    const item = this.props.solves[columnIndex];
    const handleItemClick = () => {
      this.props.onCellClicked(item);
    };
    return (
      <div key={key} style={style}>
        <Button
          key={key}
          className="cell"
          ripple={false}
          onClick={handleItemClick}
        >
          {formatTime(item.time)}
        </Button>
      </div>
    );
  };

  render() {
    const { solves } = this.props;

    return (
      <div className="solves-sheet">
        {/*<div className="caret-icon">
          <IconToggle>
            {this.state.isExpanded ? <CaretDownIcon /> : <CaretUpIcon />}
          </IconToggle>
        </div>*/}
        <div className="container">
          <div className="solves-background">
            <AutoSizer>
              {({ width, height }) => (
                <Grid
                  className="solves-hlist"
                  cellRenderer={this.renderCell}
                  scrollToColumn={solves.length - 1}
                  columnCount={solves.length}
                  columnWidth={64}
                  height={48}
                  rowCount={1}
                  rowHeight={48}
                  width={width}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    );
  }
}

export default SolvesSheet;
