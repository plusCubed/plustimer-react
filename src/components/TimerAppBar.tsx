import * as React from 'react';

import './TimerAppBar.css';

import Button from 'preact-material-components/Button';
import Toolbar from 'preact-material-components/Toolbar';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Toolbar/style.css';
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
    <Toolbar className="mdc-theme--dark app-bar" fixed={true}>
      <Toolbar.Row>
        <Toolbar.Section align-start={true}>
          <Select
            className="puzzle-select"
            onChange={onPuzzleSelected}
            selectedIndex={selectedPuzzle}
          >
            {puzzles.map((option, index) => (
              <Select.Item key={option}>{option}</Select.Item>
            ))}
          </Select>

          <Select
            className="category-select"
            onChange={onCategorySelected}
            selectedIndex={selectedCategory}
          >
            {categories.map((option, index) => (
              <Select.Item key={option}>{option}</Select.Item>
            ))}
          </Select>
        </Toolbar.Section>

        <Toolbar.Section align-end={true}>
          {loggedIn ? (
            <img
              className="app-bar-avatar"
              alt={avatarAltName}
              src={avatarImg}
              onClick={onAvatarClick}
            />
          ) : (
            <Button ripple={true} onClick={onLoginClick}>
              Login
            </Button>
          )}
        </Toolbar.Section>
      </Toolbar.Row>
    </Toolbar>
  );
};

export default TimerAppBar;
