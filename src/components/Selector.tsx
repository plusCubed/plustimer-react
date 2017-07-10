import * as React from 'react';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuList, MenuItem } from 'material-ui/Menu';

export interface Props {
  readonly options: any[];
  readonly handleSelect: (index: number) => void;
}

interface State {
  readonly anchorEl?: EventTarget;
  readonly open: boolean;
  readonly selectedIndex: number;
}

class Selector extends React.Component<Props, State> {
  state = {
    anchorEl: undefined,
    open: false,
    selectedIndex: 0
  };

  handleClick = (event: Event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event: Event, index: number) => {
    this.setState({ selectedIndex: index, open: false });
    this.props.handleSelect(index);
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClick} color="inherit">
          {this.props.options[this.state.selectedIndex]}
        </Button>

        <Menu
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          {this.props.options.map((option, index) =>
            <SelectorItem
              option={option}
              index={index}
              selectedIndex={this.state.selectedIndex}
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
