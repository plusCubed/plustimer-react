import * as React from 'react';
import './App.css';
import CurrentTimer from './containers/CurrentTimer';
import CurrentSolvesSheet from './containers/CurrentSolvesSheet';

import 'typeface-roboto';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CurrentScramble from './containers/CurrentScramble';

import image from './assets/temp_avatar.png';

const App = () => {
    return (
        <MuiThemeProvider>
            <div className="App">
                <AppBar>
                    <Toolbar>
                        <Typography type="title" color="inherit">plusTimer</Typography>

                        <img
                            alt="Adelle Charles"
                            src={image}
                            style={{width: 48, height: 48}}
                        />
                    </Toolbar>
                </AppBar>

                <CurrentScramble/>

                <CurrentTimer/>

                <CurrentSolvesSheet/>
            </div>
        </MuiThemeProvider>
    );
};

export default App;
