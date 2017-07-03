import * as React from 'react';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { Grid, GridCellProps } from 'react-virtualized/dist/es/Grid';

type RenderItemInput<TItem> = {
  isVisible: boolean;
  isScrolling: boolean;
  columnIndex: number;
  columnCount: number;
  columnWidth: number;
  rowIndex: number;
  rowCount: number;
  item: TItem;
  index: number;
};

type Props<TItem> = {
  minItemWidth: number;
  dynamicRowHeight?: boolean;
  items: Array<any>;
  renderItem: (input: RenderItemInput<any>) => any;
  overscanRowCount?: number;

  // Grid props
  style?: any;
  className?: any;
  onScroll?: any;
  innerRef?: any;
};

// NOTE: Component is intentionally used instead of PureComponent,
// as renderItem's internals may adjust independent of props provided to
// this component
export default class VirtualizedItemGrid<TItem> extends React.PureComponent<
  Props<TItem>,
  {}
> {
  public static defaultProps = {
    dynamicRowHeight: false,
    overscanRowCount: 10
  };

  private containerWidth: number;
  private containerHeight: number;
  private cellRenderer: any;

  getMinItemWidth(containerWidth: number, containerHeight: number) {
    const { minItemWidth } = this.props;
    if (typeof minItemWidth === 'function') {
      return minItemWidth({ containerWidth, containerHeight });
    }
    return minItemWidth;
  }

  renderCell(
    cellData: GridCellProps,
    columnCount: number,
    rowCount: number,
    columnWidth: number
  ) {
    const {
      key,
      style,
      isVisible,
      isScrolling,
      columnIndex,
      rowIndex
    } = cellData;
    const visible = isVisible || false;
    const scrolling = isScrolling || false;
    const { items, renderItem: ItemComponent } = this.props;
    let normalizedRowIndex = rowIndex;
    const index = normalizedRowIndex * columnCount + columnIndex;
    if (index >= items.length) {
      return null;
    }
    const item = items[index];
    if (item === undefined) {
      return null;
    }

    return (
      <div key={key} style={style}>
        <ItemComponent
          isVisible={visible}
          isScrolling={scrolling}
          columnIndex={columnIndex}
          columnCount={columnCount}
          columnWidth={columnWidth}
          rowIndex={normalizedRowIndex}
          rowCount={rowCount}
          item={items[index]}
          index={index}
        />
      </div>
    );
  }

  renderWithKnownSize(containerWidth: number, containerHeight: number) {
    if (!containerWidth) {
      return null;
    }
    const {
      minItemWidth: miw,
      dynamicRowHeight,
      items,
      renderItem,
      overscanRowCount,
      innerRef,
      ...passThroughProps
    } = this.props;

    const itemCount = items.length;

    const minItemWidth = Math.max(
      1,
      this.getMinItemWidth(containerWidth, containerHeight)
    );

    // Max whole number of columns that will fit
    const columnCount = Math.trunc(containerWidth / minItemWidth);
    // Truncate to whole number pixels (otherwise virtualscroll puts last item on next line)
    const columnWidth = containerWidth / columnCount;

    const rowCount = Math.ceil(itemCount / columnCount);

    // Keep cache and cell renderer same unless container size changes
    if (
      this.containerWidth !== containerWidth ||
      this.containerHeight !== containerHeight
    ) {
      const cellRenderer = (data: GridCellProps) =>
        this.renderCell(data, columnCount, rowCount, columnWidth);

      this.containerWidth = containerWidth;
      this.containerHeight = containerHeight;
      this.cellRenderer = cellRenderer;
    }

    const itemCountProp = {
      itemCount: itemCount
    };

    return (
      <Grid
        ref={innerRef}
        cellRenderer={this.cellRenderer}
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={48}
        width={containerWidth}
        overscanRowCount={overscanRowCount}
        {...passThroughProps}
        {...itemCountProp}
      />
    );
  }

  render() {
    return (
      <AutoSizer>
        {({ width, height }) => this.renderWithKnownSize(width, height)}
      </AutoSizer>
    );
  }
}
