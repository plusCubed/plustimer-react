import { Component } from 'preact';
import { shallowEqual } from './utils';

export class PureComponent extends Component {
  shouldComponentUpdate(props, state) {
    return !(
      shallowEqual(props, this.props) && shallowEqual(state, this.state)
    );
  }
}

export { Component };
