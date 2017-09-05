import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import App from './App';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootEpic from './epics/index';
import rootReducer from './reducers/index';
import { SolvesService } from './services/solvesService';
import { ScrambleService } from './services/scrambleService';
import { AccountService } from './services/accountService';

import 'default-passive-events/default-passive-events';
import 'preact/debug';
import * as ReactGA from 'react-ga';
import registerServiceWorker from './registerServiceWorker';

const solvesService = new SolvesService();
const scrambleService = new ScrambleService();
const accountService = new AccountService();

const epicMiddleware = createEpicMiddleware(rootEpic, {
  dependencies: {
    solvesService: solvesService,
    scrambleService: scrambleService,
    accountService: accountService
  }
});
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
if (!('serviceWorker' in navigator)) OfflinePluginRuntime.install();

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-65643346-2');
  ReactGA.pageview('/');
}
