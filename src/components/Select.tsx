import { h } from 'preact';
import PureComponent from './PureComponent';

import style from './Select.css';

interface Props {
  defaults: Map<string, string>;
  //uid: string;
  //path: string;
  onChange: (value: string) => any;
  value: string;
}

interface State {
  options: Map<string, string>;
}

class Select extends PureComponent<Props, State> {
  state = {
    options: new Map()
  };

  async componentDidUpdate(prevProps: Props, prevState: State) {
    // Check that the path changed and is valid
    /*if (
      /!*this.props.uid &&*!/
      this.props.path !== prevProps.path &&
      !this.props.path.split('/').includes('')
    ) {
      /!*const firestore = await firebase.firestore(this.props.uid);
      const collectionRef = firestore.collection(this.props.path);
      const querySnapshot = await collectionRef.get();
      const docSnapshots = querySnapshot.docs;
      const options: Map<string, string> = docSnapshots.reduce(
        (options, doc) => {
          if (doc.exists && doc.data().name)
            options.set(doc.id, doc.data().name);
          return options;
        },
        new Map(this.props.defaults)
      );

      this.setState({ options: options });*!/
    }*/
  }

  handleChange = (event: Event) => {
    this.props.onChange((event.target as any).value);
  };

  render() {
    return (
      <select
        className={style.select}
        value={this.props.value}
        onChange={this.handleChange}
      >
        {Array.from(this.state.options.entries()).map(([key, value]) => (
          <option value={key}>{value}</option>
        ))}
      </select>
    );
  }
}

export default Select;
