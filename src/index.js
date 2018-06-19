import AppWrapper from './components/AppWrapper';

import handleRenderErrors from './utils/errors';

import './index.css';

if (process.env.NODE_ENV !== 'production') {
  handleRenderErrors();
}

export default AppWrapper;
