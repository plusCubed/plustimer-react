import { h } from 'preact';
import PureComponent from './PureComponent';

import style from './Select.css';

interface Props {
  options: Map<string, string>;
  onChange: (value: string) => any;
  value: string;
}

interface State {

}

class Select extends PureComponent<Props, State> {

  private handleChange = (event: Event) => {
    this.props.onChange((event.target as any).value);
  };

  public render() {
    let options: any[];
    if (this.props.options) {
      options = Array.from(this.props.options.entries())
        .map(([key, value]) => (
          <option value={key}>{value}</option>
        ));
    } else {
      options = null;
    }

    return (
      <select
        className={style.select}
        value={this.props.value}
        onChange={this.handleChange}
      >
        {options}
      </select>
    );
  }
}

export default Select;
