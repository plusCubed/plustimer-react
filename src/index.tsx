import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import rootEpic from './epics/index';
import rootReducer from './reducers/index';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware(rootEpic);
const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
