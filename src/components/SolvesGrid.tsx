import * as React from 'react';

import './SolvesGrid.css';

import { Solve } from '../services/solvesService';
import { formatTime } from '../utils/util';

import Button from 'preact-material-components/Button';
import 'preact-material-components/IconToggle/style.css';
import 'preact-material-components/Button/style.css';

import VirtualizedItemGrid from './VirtualizedItemGrid';

export interface StoreStateProps {
  readonly solves: Solve[];
}

export interface DispatchProps {
  readonly onCellClicked: (solve: Solve) => void;
}

export interface Props extends StoreStateProps, DispatchProps {}

export interface State {}

class SolvesGrid extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  renderCell = ({ item }: { item: Solve }) => {
    const handleItemClick = () => {
      this.props.onCellClicked(item);
    };
    return (
      <Button className="cell" ripple={false} onClick={handleItemClick}>
        {formatTime(item.time)}
      </Button>
    );
  };

  render() {
    const { solves } = this.props;

    return (
      <div className="solves-sheet">
        <VirtualizedItemGrid
          minItemWidth={64}
          items={solves}
          renderItem={this.renderCell}
          className="solves-grid"
        />
      </div>
    );
  }
}

export default SolvesGrid;
