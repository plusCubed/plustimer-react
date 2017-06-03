import * as React from 'react';
import './App.css';
import CurrentTimer from './containers/CurrentTimer';
import CurrentSolvesSheet from './containers/CurrentSolvesSheet';

import 'typeface-roboto';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import injectTapEventPlugin = require('react-tap-event-plugin');

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => {
    return (
        <MuiThemeProvider>
            <div className="App">
                <AppBar>
                    <Toolbar>
                        <Typography type="title" colorInherit={true}>plusTimer</Typography>
                    </Toolbar>
                </AppBar>

                <CurrentTimer/>

                <CurrentSolvesSheet/>
            </div>
        </MuiThemeProvider>
    );
};

export default App;
