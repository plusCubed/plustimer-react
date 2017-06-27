import * as React from 'react';

import './TimerAppBar.css';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import image from '../assets/temp_avatar.png';

export interface StoreStateProps {
}

export interface DispatchProps {
    readonly handleAvatarClick: () => void;

}

export interface Props extends StoreStateProps, DispatchProps {
}

const TimerAppBar = ({handleAvatarClick}: Props) => {
    return (
        <AppBar>
            <Toolbar>
                <Typography className="app-bar-text" type="title" color="inherit">plusTimer</Typography>

                <img
                    className="app-bar-avatar"
                    alt="Adelle Charles"
                    src={image}
                    onClick={handleAvatarClick}
                />
            </Toolbar>
        </AppBar>
    );
};

export default TimerAppBar;