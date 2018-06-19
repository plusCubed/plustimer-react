import { Component } from 'preact';
import { shallowEqual } from '../utils/utils';

export default abstract class PureComponent<P, S> extends Component<P, S> {
  public shouldComponentUpdate(props, state) {
    return !(
      shallowEqual(props, this.props) && shallowEqual(state, this.state)
    );
  }
}
