import * as React from 'react';
import { MDCRipple } from '@material/ripple';

export default class RippleDiv extends React.Component {
  constructor() {
    super();
  }
  attachRipple() {
    if (this.control) {
      MDCRipple.attachTo(this.control);
    }
  }
  render() {
    return (
      <div ref={control => (this.control = control)}>{this.props.children}</div>
    );
  }
}
