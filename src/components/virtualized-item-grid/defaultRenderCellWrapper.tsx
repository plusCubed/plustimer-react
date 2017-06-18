import * as React from 'react';

export interface Props {
    style: React.CSSProperties;
}

export default class CellWrapper extends React.PureComponent<Props, {}> {
    render() {
        const {style, children} = this.props;
        return <div style={style}>{children}</div>;
    }
}
