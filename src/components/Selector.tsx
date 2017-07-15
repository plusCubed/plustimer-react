import * as React from 'react';

import Button from 'material-ui/Button';
import Menu, { MenuList, MenuItem } from 'material-ui/Menu';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';

import './Selector.css';

export interface Props {
  readonly options: string[];
  readonly handleSelect: (index: number) => void;
  readonly selectedIndex: number;
}

interface State {
  readonly anchorEl?: EventTarget;
  readonly open: boolean;
}

class Selector extends React.PureComponent<Props, State> {
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
    return (
      <div className="selector">
        <Button
          className="selector-button"
          onClick={this.handleClick}
          color="inherit"
        >
          {this.props.options[this.props.selectedIndex]}
          <ArrowDropDown />
        </Button>

        <Menu
          className="selector-menu"
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
