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
                {/*<div className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <h2>Welcome to React</h2>
                  </div>
                  <p className="App-intro">
                      To get started, edit <code>src/App.js</code> and save to reload.
                  </p>*/}

                <AppBar className="toolbar"/>

                <Timer/>
            </div>
        </MuiThemeProvider>
    );
};

export default App;
