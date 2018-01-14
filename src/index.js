// @flow

import AppContainer from './containers/AppContainer';

import './index.css';

if (
  process.env.NODE_ENV !== 'development' &&
  process.env.ADD_SW &&
  'serviceWorker' in navigator &&
  location.protocol === 'https:' &&
  navigator.serviceWorker.controller
) {
  navigator.serviceWorker.controller.onstatechange = event => {
    if (event.target.state === 'redundant') {
      console.log('New content is available; please refresh.');
      window.location.reload();
    }
  };
}

export default AppContainer;
