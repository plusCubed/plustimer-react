import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import rootEpic from './epics/index';
import rootReducer from './reducers/index';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';

const epicMiddleware = createEpicMiddleware(rootEpic);
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

registerServiceWorker();
