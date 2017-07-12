import * as React from 'react';

import Button from 'material-ui/Button';
import Menu, { MenuList, MenuItem } from 'material-ui/Menu';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';

export interface Props {
  readonly options: string[];
  readonly handleSelect: (index: number) => void;
  readonly selectedIndex: number;
}

interface State {
  readonly anchorEl?: EventTarget;
  readonly open: boolean;
}

class Selector extends React.Component<Props, State> {
  state = {
    anchorEl: undefined,
    open: false
  };

  private static menuAnchorOrigin = {
    vertical: 'center',
    horizontal: 'center'
  };

  private static menuTransformOrigin = {
    vertical: 'center',
    horizontal: 'center'
  };

  private static selectorStyle = {
    height: '100%'
  };

  private static menuStyle = {
    maxHeight: 'calc(100vh - 16px)'
  };

  private static buttonStyle = {
    fontSize: 18,
    fontWeight: 500,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
    padding: '0 0 0 12px',
    borderRadius: 0,
    height: '100%',
    textTransform: 'none'
  };

  handleClick = (event: Event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event: Event, index: number) => {
    this.setState({ open: false });
    this.props.handleSelect(index);
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    // TODO: Properly override material-ui styles
    return (
      <div style={Selector.selectorStyle}>
        <Button
          style={Selector.buttonStyle}
          onClick={this.handleClick}
          color="inherit"
        >
          {this.props.options[this.props.selectedIndex]}
          <ArrowDropDown />
        </Button>

        <Menu
          style={Selector.menuStyle}
          anchorEl={this.state.anchorEl}
          anchorOrigin={Selector.menuAnchorOrigin}
          transformOrigin={Selector.menuTransformOrigin}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          {this.props.options.map((option, index) =>
            renderSelectorItem({
              option: option,
              index: index,
              selected: index === this.props.selectedIndex,
              handleMenuItemClick: this.handleMenuItemClick
            })
          )}
        </Menu>
      </div>
    );
  }
}

const renderSelectorItem = ({
  option,
  index,
  selected,
  handleMenuItemClick
}: {
  option: string;
  index: number;
  selected: boolean;
  handleMenuItemClick: (event: Event, index: number) => void;
}) => {
  const handleClick = (e: Event) => handleMenuItemClick(e, index);

  return (
    <MenuItem key={option} selected={selected} onClick={handleClick}>
      {option}
    </MenuItem>
  );
};

export default Selector;
