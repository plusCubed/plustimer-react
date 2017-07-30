import * as React from 'react';

import './TimerAppBar.css';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';

import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';

export interface StoreStateProps {
  readonly loggedIn: boolean;
  readonly avatarAltName?: string;
  readonly avatarImg?: string;
  readonly puzzles: string[];
  readonly categories: string[];
  readonly selectedPuzzle: number;
  readonly selectedCategory: number;
}

export interface DispatchProps {
  readonly onAvatarClick: () => void;
  readonly onLoginClick: () => void;
  readonly onPuzzleSelected: (e: any) => void;
  readonly onCategorySelected: (e: any) => void;
}

export interface Props extends StoreStateProps, DispatchProps {}

const TimerAppBar = ({
  loggedIn,
  avatarAltName,
  avatarImg,
  puzzles,
  categories,
  selectedPuzzle,
  selectedCategory,
  onAvatarClick,
  onLoginClick,
  onPuzzleSelected,
  onCategorySelected
}: Props) => {
  return (
    <AppBar>
      <Toolbar className="mdc-theme--dark">
        <Select
          className="puzzle-select"
          onChange={onPuzzleSelected}
          selectedIndex={selectedPuzzle}
        >
          {puzzles.map((option, index) =>
            <Select.Item key={option}>
              {option}
            </Select.Item>
          )}
        </Select>

        <Select
          className="category-select"
          onChange={onCategorySelected}
          selectedIndex={selectedCategory}
        >
          {categories.map((option, index) =>
            <Select.Item key={option}>
              {option}
            </Select.Item>
          )}
        </Select>

        <div className="app-bar-spacer" />

        {loggedIn
          ? <img
              className="app-bar-avatar"
              alt={avatarAltName}
              src={avatarImg}
              onClick={onAvatarClick}
            />
          : <Button color="contrast" onClick={onLoginClick}>
              Login
            </Button>}
      </Toolbar>
    </AppBar>
  );
};

export default TimerAppBar;
