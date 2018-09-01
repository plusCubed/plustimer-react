import { h } from 'preact';
import PureComponent from './PureComponent';

import App from '../components/App';
import * as preferences from '../utils/preferences';

interface IState {
  signingIn: boolean;
  updateAvailable: boolean;
}

class AppWrapper extends PureComponent<void, IState> {
  public readonly state = {
    signingIn: false,
    updateAvailable: false
  };

  constructor(props) {
    super(props);

    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.ADD_SW &&
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      navigator.serviceWorker.controller.onstatechange = event => {
        if ((event.target as any).state === 'redundant') {
          this.setState({ updateAvailable: true });
        }
      };
    }
  }

  public async componentDidMount() {
  }
  public readonly onAuthStateChanged = async (user: any) => {
  };

  public componentWillUnmount() {}

  public render() {
    return (
      <App
        signingIn={this.state.signingIn}
        updateAvailable={this.state.updateAvailable}
      />
    );
  }
}

export default AppWrapper;
