// @flow

import { h } from 'preact';
import * as React from '../utils/purecomponent';
import { connect } from 'unistore/full/preact.es';

import { buildMapFromObject } from '../utils/utils';
import firebase from '../utils/firebase';
import * as firebaseUtils from '../utils/firebaseUtils';
import * as preferences from '../utils/preferences';

import Select from '../components/Select';

import puzzleDefaults from '../puzzleDefaults.json';

type Props = {
  uid: string
};

type State = {
  puzzle: string,
  category: string
};

@connect('uid')
class PuzzleCategorySelect extends React.PureComponent<Props, State> {
  defaultPuzzles: Map<string, string>;
  defaultCategories: Map<string, Map<string, string>>;

  state = {
    puzzle: '',
    category: ''
  };

  constructor(props: Props) {
    super(props);
    this.defaultPuzzles = Object.entries(puzzleDefaults).reduce(
      (map, [key, value]: [string, any]) => {
        map.set(key, value.name);
        return map;
      },
      new Map()
    );

    this.defaultCategories = Object.entries(puzzleDefaults).reduce(
      (map, [key, value]: [string, any]) => {
        map.set(key, buildMapFromObject(value.categories));
        return map;
      },
      new Map()
    );
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.uid !== prevProps.uid && this.props.uid) {
      let currentPuzzle = preferences.getItem('puzzle');
      if (!currentPuzzle) {
        currentPuzzle = '333';
      }

      await this.handlePuzzleChange(currentPuzzle);
    }
  }

  handlePuzzleChange = async (puzzle: string) => {
    this.setState({ puzzle: puzzle });

    console.log('New puzzle', puzzle);

    const firestore = await firebase.firestore(this.props.uid);
    const userRef = firestore.collection('users').doc(this.props.uid);

    // Set current puzzle
    preferences.setItem('puzzle', puzzle);

    // Get the current category for the selected puzzle
    const puzzleRef = userRef.collection('puzzles').doc(puzzle);
    const puzzleDoc = await firebaseUtils.getDoc(puzzleRef);
    let newCategory;

    const savedCategory = JSON.parse(preferences.getItem('category'));
    if (savedCategory) {
      newCategory = savedCategory[puzzle];
    }

    if (!newCategory) {
      if (puzzleDoc.exists) {
        const categoriesSnapshot = await puzzleDoc.ref
          .collection('categories')
          .get();
        newCategory = categoriesSnapshot.docs[0].id;
      } else {
        newCategory = 'normal';
      }
    }

    await this.handleCategoryChange(newCategory, puzzle);
  };

  handleCategoryChange = async (
    category: string,
    puzzle: string = this.state.puzzle
  ) => {
    this.setState({ category: category });

    console.log('New category', category, puzzle);

    if (!category) {
      return;
    }

    // Set current category in the puzzle doc
    const savedCategories = JSON.parse(preferences.getItem('category'));
    preferences.setItem(
      'category',
      JSON.stringify({
        ...savedCategories,
        [puzzle]: category
      })
    );
  };

  render() {
    return (
      <span>
        <Select
          uid={this.props.uid}
          value={this.state.puzzle}
          defaults={this.defaultPuzzles}
          path={`users/${this.props.uid}/puzzles`}
          onChange={this.handlePuzzleChange}
        />

        <Select
          uid={this.props.uid}
          value={this.state.category}
          defaults={this.defaultCategories.get(this.state.puzzle)}
          path={`users/${this.props.uid}/puzzles/${
            this.state.puzzle
          }/categories`}
          onChange={this.handleCategoryChange}
        />
      </span>
    );
  }
}

export default PuzzleCategorySelect;
