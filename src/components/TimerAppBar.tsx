import * as React from 'react';

import './TimerAppBar.css';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Selector from './Selector';

export interface StoreStateProps {
  readonly loggedIn: boolean;
  readonly avatarAltName?: string;
  readonly avatarImg?: string;
  readonly puzzles: string[];
}

export interface DispatchProps {
  readonly handleAvatarClick: () => void;
  readonly handleLoginClick: () => void;
}

export interface Props extends StoreStateProps, DispatchProps {}

const TimerAppBar = ({
  loggedIn,
  avatarAltName,
  avatarImg,
  puzzles,
  handleAvatarClick,
  handleLoginClick
}: Props) => {
  return (
    <AppBar>
      <Toolbar>
        <Typography type="title" color="inherit">
          plusTimer
        </Typography>

        <Selector options={puzzles} handleSelect={() => {}} />

        <div className="app-bar-spacer" />

        {loggedIn
          ? <img
              className="app-bar-avatar"
              alt={avatarAltName}
              src={avatarImg}
              onClick={handleAvatarClick}
            />
          : <Button color="contrast" onClick={handleLoginClick}>
              Login
            </Button>}
      </Toolbar>
    </AppBar>
  );
};

export default TimerAppBar;
