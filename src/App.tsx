import * as React from 'react';
import './App.css';
import {MuiThemeProvider} from 'material-ui/styles';
import {AppBar} from 'material-ui';
import Timer from './containers/Timer';
import injectTapEventPlugin = require('react-tap-event-plugin');

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => {
    return (
        <MuiThemeProvider>
            <div className="App">
                <AppBar className="toolbar"/>

                <Timer/>
            </div>
        </MuiThemeProvider>
    );
};

export default App;
