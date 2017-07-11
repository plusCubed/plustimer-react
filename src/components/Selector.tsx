import * as React from 'react';

import './Selector.css';

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
    vertical: 'top',
    horizontal: 'center'
  };

  private static menuTransformOrigin = {
    vertical: 'top',
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
    // Styles don't override material-ui in development due to head css order
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
            <SelectorItem
              option={option}
              index={index}
              selectedIndex={this.props.selectedIndex}
              handleMenuItemClick={this.handleMenuItemClick}
            />
          )}
        </Menu>
      </div>
    );
  }
}

type SelectorItemProps = {
  option: string;
  index: number;
  selectedIndex: number;
  handleMenuItemClick: (event: Event, index: number) => void;
};

const SelectorItem = ({
  option,
  index,
  selectedIndex,
  handleMenuItemClick
}: SelectorItemProps) => {
  const handleClick = (e: Event) => handleMenuItemClick(e, index);

  return (
    <MenuItem
      key={option}
      selected={index === selectedIndex}
      onClick={handleClick}
    >
      {option}
    </MenuItem>
  );
};

export default Selector;
