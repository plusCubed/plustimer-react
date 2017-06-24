import './polyfills.js';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './patch.js';

import './index.css';

import App from './App';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import rootEpic from './epics/index';
import rootReducer from './reducers/index';
import {SolvesService} from './services/solves-service';

import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';

import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';
import {ScrambleService} from './services/scramble-service';

import 'default-passive-events/default-passive-events';

import 'preact/devtools';
import {AccountService} from './services/account-service';

const solvesService = new SolvesService();
const scrambleService = new ScrambleService();
const accountService = new AccountService();

const epicMiddleware = createEpicMiddleware(
    rootEpic,
    {
        dependencies: {
            solvesService: solvesService,
            scrambleService: scrambleService,
            accountService: accountService
        }
    }
);
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

OfflinePluginRuntime.install({
    onUpdateReady: () => {
        console.log('SW Event:', 'onUpdateReady');
        OfflinePluginRuntime.applyUpdate();
    },
    onUpdated: () => {
        console.log('SW Event:', 'onUpdated');
        // TODO: Use snackbar for proper updating
        window.location.reload();
    },
});
