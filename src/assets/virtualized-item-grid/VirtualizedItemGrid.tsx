import * as React from 'react';
import {AutoSizer, CellMeasurer, CellMeasurerCache, Grid, GridCellProps, ScrollParams} from 'react-virtualized';
import defaultRenderCellWrapper from './defaultRenderCellWrapper';

type IdealItemWidthInput = {
    containerWidth: number,
    containerHeight: number,
};

type RenderItemInput<TItem> = {
    isVisible: boolean,
    isScrolling: boolean,
    columnIndex: number,
    columnCount: number,
    columnWidth: number,
    rowIndex: number,
    rowCount: number,
    item: TItem,
    index: number,
};

type RenderHeaderInput = {
    isVisible: boolean,
    isScrolling: boolean,
};

type RenderFooterInput = {
    isVisible: boolean,
    isScrolling: boolean,
};

type Style = {};

type RenderCellWrapperInput = {
    style: Style,
    children: any,
    isHeader: boolean,
    isFooter: boolean,
    isItem: boolean,
};

type Props<TItem> = {
    idealItemWidth: number | ((input: IdealItemWidthInput) => number);
    dynamicRowHeight?: boolean;
    items: Array<TItem>;
    renderItem: (input: RenderItemInput<TItem>) => any;
    overscanRowCount?: number;
    header?: any | ((input: RenderHeaderInput) => any) | null;
    footer?: any | ((input: RenderFooterInput) => any) | null;
    renderCellWrapper?: (input: RenderCellWrapperInput) => any;

    // Grid props
    className?: string;
    onScroll?: (params: ScrollParams) => any;
};

// NOTE: Component is intentionally used instead of PureComponent,
// as renderItem's internals may adjust independent of props provided to
// this component
export default class VirtualizedItemGrid<TItem> extends React.PureComponent<Props<TItem>, {}> {

    public static defaultProps = {
        dynamicRowHeight: false,
        overscanRowCount: 2,
        header: (null),
        footer: (null),
        renderCellWrapper: defaultRenderCellWrapper,
    };

    getIdealItemWidth(containerWidth: number, containerHeight: number) {
        const {idealItemWidth} = this.props;
        if (typeof idealItemWidth === 'function') {
            return idealItemWidth({containerWidth, containerHeight});
        }
        return idealItemWidth;
    }

    renderHeader(style: Style,
                 header: (any | ((input: RenderHeaderInput) => any)),
                 isVisible: boolean,
                 isScrolling: boolean) {

        const {renderCellWrapper} = this.props;
        const CellWrapper = renderCellWrapper as (input: RenderCellWrapperInput) => any;

        let element;
        if (typeof header === 'function') {
            const Header = header;
            element = <Header isVisible={isVisible} isScrolling={isScrolling}/>;
        } else {
            element = header;
        }
        return (
            <CellWrapper
                key="header"
                style={style}
                isHeader={true}
                isFooter={false}
                isItem={false}
                children={element}
            />
        );
    }

    renderFooter(style: Style,
                 footer: (any | ((input: RenderFooterInput) => any)),
                 isVisible: boolean,
                 isScrolling: boolean) {

        const {renderCellWrapper} = this.props;
        const CellWrapper = renderCellWrapper as (input: RenderCellWrapperInput) => any;

        let element;
        if (typeof footer === 'function') {
            const Footer = footer;
            element = <Footer isVisible={isVisible} isScrolling={isScrolling}/>;
        } else {
            element = footer;
        }
        return (
            <CellWrapper
                key="footer"
                style={style}
                isHeader={false}
                isFooter={true}
                isItem={false}
                children={element}
            />
        );
    }

    renderItem(style: Style, element: any, key?: string) {
        const {renderCellWrapper} = this.props;
        const CellWrapper = renderCellWrapper as (input: RenderCellWrapperInput) => any;

        return (
            <CellWrapper
                key={key || 'item'}
                style={style}
                isHeader={false}
                isFooter={false}
                isItem={true}
                children={element}
            />
        );
    }

    renderCell(cellData: GridCellProps,
               columnCount: number,
               rowCount: number,
               columnWidth: number,
               containerWidth: number,
               cache: CellMeasurerCache) {

        const {key, parent, style, isVisible, isScrolling, columnIndex, rowIndex} = cellData;
        const visible = isVisible || false;
        const scrolling = isScrolling || false;
        const {items, renderItem: ItemComponent, header, footer} = this.props;
        let normalizedRowIndex = rowIndex;
        if (header) {
            if (rowIndex === 0) {
                if (columnIndex === 0) {
                    return this.renderHeader({...style, width: containerWidth}, header, visible, scrolling);
                }
                return null;
            }
            normalizedRowIndex -= 1;
        }
        if (footer && normalizedRowIndex === rowCount) {
            if (columnIndex === 0) {
                return this.renderFooter({...style, width: containerWidth}, footer, visible, scrolling);
            }
            return null;
        }
        const index = (normalizedRowIndex * columnCount) + columnIndex;
        if (index >= items.length) {
            return null;
        }
        const item = items[index];
        if (item === undefined) {
            return null;
        }

        const element = (
            <CellMeasurer
                cache={cache}
                columnIndex={columnIndex}
                key={key}
                parent={parent as any}
                rowIndex={rowIndex}
            >
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
            </CellMeasurer>
        );
        return this.renderItem(style, element, key);
    }

    renderWithKnownSize(containerWidth: number, containerHeight: number) {
        if (!containerWidth) {
            return null;
        }
        const {
            items,
            overscanRowCount,
            header,
            footer,
            ...passThroughProps
        } = this.props;

        const itemCount = items.length;

        const idealItemWidth = Math.max(1, this.getIdealItemWidth(containerWidth, containerHeight));

        const columnCountEstimate = Math.max(1, Math.floor(containerWidth / idealItemWidth));
        const rowCount = Math.ceil(itemCount / columnCountEstimate);
        // We can now recalculate the columnCount knowing how many rows we must
        // display. In the typical case, this is going to be equivalent to
        // `columnCountEstimate`, but if in the case of 5 items and 4 columns, we
        // can fill out to display a a 3x2 with 1 hole instead of a 4x2 with 3
        // holes.
        const columnCount = Math.max(1, itemCount && Math.ceil(itemCount / rowCount));

        const columnWidth = containerWidth / columnCount;
        const extraRowCount = (header ? 1 : 0) + (footer ? 1 : 0);

        const cache = new CellMeasurerCache({
            keyMapper: () => `${containerWidth}:${containerHeight}:${header ? 1 : 0}:${footer ? 1 : 0}`,
            defaultWidth: columnWidth,
            fixedWidth: true
        });

        const cellRenderer = (data: GridCellProps) =>
            this.renderCell(data, columnCount, rowCount, columnWidth, containerWidth, cache);

        return (
            <Grid
                cellRenderer={cellRenderer}
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={containerHeight}
                rowCount={rowCount + extraRowCount}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight as any}
                width={containerWidth}
                overscanRowCount={overscanRowCount}
                {...passThroughProps}
            />
        );
    }

    render() {
        return (
            <AutoSizer>
                {({width, height}) => this.renderWithKnownSize(width, height)}
            </AutoSizer>
        );
    }
}
