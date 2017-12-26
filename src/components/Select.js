import * as React from 'react';

import style from './Select.css';

import firebase from '../utils/firebase';

type Props = {
  defaults: Map<string, string>,
  path: string,
  onChange: (value: string) => void,
  value: string
};

type State = {
  options: Map<string, string>
};

class Select extends React.PureComponent<Props, State> {
  state = {
    options: new Map()
  };

  async componentDidUpdate(prevProps, prevState) {
    // Check that the path changed and is valid
    if (
      this.props.path !== prevProps.path &&
      !this.props.path.split('/').includes('')
    ) {
      const firestore = await firebase.firestore();
      const collectionRef = firestore.collection(this.props.path);
      const querySnapshot = await collectionRef.get();
      const docSnapshots = querySnapshot.docs;
      const options: Map<string, string> = docSnapshots.reduce(
        (options, doc) => {
          options.set(doc.id, doc.data().name);
          return options;
        },
        this.props.defaults
      );

      console.log('Select Options', this.props.path, options);
      this.setState({ options: options });
    }
  }

  handleChange = event => {
    this.props.onChange(event.target.value);
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
