// @flow

import * as React from 'react';

import AppBar from '../components/AppBar';

class AppBarContainer extends React.PureComponent<void, void> {
  handleLoginClick = () => {
    window.open('popup.html', '_blank', 'height=585,width=400');
  };

  render() {
    return <AppBar onLoginClick={this.handleLoginClick} />;
  }
}

export default AppBarContainer;
