import { h } from 'preact';
import Dialog from 'preact-material-components/Dialog';

class DialogWrapper extends Dialog {
  constructor() {
    super();
    this._onCancel = this._onCancel.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.open) {
      this.MDComponent.open();
    }
    this.MDComponent.listen('MDCDialog:cancel', this._onCancel);
  }

  _onCancel(e) {
    if (this.props.onCancel) {
      this.props.onCancel(e);
    }
  }

  componentWillUnmount() {
    this.MDComponent.unlisten('MDCDialog:cancel', this._onCancel);

    super.componentWillUnmount();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.open !== this.props.open &&
      this.props.open !== this.MDComponent.open
    ) {
      if (this.props.open) this.MDComponent.show();
      else this.MDComponent.close();
    }
  }
}

export default DialogWrapper;
