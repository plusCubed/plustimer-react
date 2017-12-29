import * as React from 'react';

import { buildMapFromObject } from '../utils/utils';
import firebase from '../utils/firebase';

import Select from '../components/Select';

import puzzleDefaults from '../puzzleDefaults.json';

type Props = {
  uid: string
};

type State = {
  puzzle: string,
  category: string
};

class PuzzleCategorySelect extends React.PureComponent<Props, State> {
  state = {
    puzzle: '',
    category: ''
  };

  constructor(props) {
    super(props);
    this.defaultPuzzles = Object.entries(puzzleDefaults).reduce(
      (map, [key, value]) => {
        map.set(key, value.name);
        return map;
      },
      new Map()
    );

    this.defaultCategories = Object.entries(puzzleDefaults).reduce(
      (map, [key, value]) => {
        map.set(key, buildMapFromObject(value.categories));
        return map;
      },
      new Map()
    );
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.uid !== prevProps.uid) {
      if (this.props.uid) {
        const firestore = await firebase.firestore(this.props.uid);
        const userDoc = await firestore.doc(`users/${this.props.uid}`).get();

        let currentPuzzle;
        if (userDoc.exists && userDoc.get('currentPuzzle')) {
          currentPuzzle = userDoc.get('currentPuzzle');
        } else {
          currentPuzzle = '333';
        }

        await this.handlePuzzleChange(currentPuzzle);
      }
    }
  }

  handlePuzzleChange = async puzzle => {
    this.setState({ puzzle: puzzle });

    if (!puzzle) {
      return;
    }

    console.log('New puzzle', puzzle);

    const firestore = await firebase.firestore(this.props.uid);

    // Set current puzzle in the user doc
    const userRef = firestore.collection('users').doc(this.props.uid);
    await userRef.set({ currentPuzzle: puzzle }, { merge: true });

    // Get the current category for the selected puzzle
    const puzzleRef = userRef.collection('puzzles').doc(puzzle);
    const puzzleDoc = await puzzleRef.get();
    let currentCategory;
    if (puzzleDoc.exists) {
      currentCategory = puzzleDoc.get('currentCategory');
    } else {
      // If the puzzle doc doesn't exist, write the default
      const puzzleData = { ...puzzleDefaults[puzzle] };
      delete puzzleData.categories;
      await puzzleDoc.ref.set(puzzleData, { merge: true });

      // Use the first category as the current
      currentCategory = Object.keys(puzzleDefaults[puzzle].categories)[0];
    }

    await this.handleCategoryChange(currentCategory);
  };

  handleCategoryChange = async (category, puzzle = this.state.puzzle) => {
    this.setState({ category: category });

    console.log('New category', category, puzzle);

    if (!category) {
      return;
    }

    const firestore = await firebase.firestore(this.props.uid);

    // Set current category in the puzzle doc
    const puzzleRef = firestore.doc(
      `users/${this.props.uid}/puzzles/${puzzle}`
    );
    await puzzleRef.set({ currentCategory: category }, { merge: true });

    // If the category doc doesn't exist, write the default (the name)
    const categoryRef = puzzleRef.collection('categories').doc(category);
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) {
      const name = puzzleDefaults[puzzle].categories[category];
      await categoryDoc.ref.set({ name: name }, { merge: true });
    }
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
