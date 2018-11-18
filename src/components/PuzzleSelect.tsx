import { h } from 'preact';
import { nSQL } from 'nano-sql';

import PureComponent from './PureComponent';

import Select from './Select';

import { Preferences } from '../utils/preferences';
import { IPuzzle } from './AppWrapper';
import { SolveRepo } from '../utils/solveRepo';

interface IProps {
  puzzle: IPuzzle
}

interface IState {
  puzzles: Map<string, string>;
  categories: {[puzzleId: number]: Map<string, string>};
}

class PuzzleSelect extends PureComponent<IProps, IState> {
  public readonly state = {
    puzzles: new Map(),
    categories: {}
  };

  constructor(props: IProps) {
    super(props);
  }

  private async init() {
    await SolveRepo.onConnected();

    const puzzles = await nSQL(SolveRepo.TABLE.PUZZLES)
      .query('select')
      .exec();

    const puzzleMap = new Map;
    puzzles.forEach(puzzle => {
      puzzleMap.set(puzzle.id, puzzle.name);
    });

    const categories = await nSQL(SolveRepo.TABLE.CATEGORIES)
      .query('select')
      .exec();

    const categoryMapMap = {};
    categories.forEach(category => {
      if(!(category.puzzleId in categoryMapMap)){
        categoryMapMap[category.puzzleId] = new Map;
      }
      categoryMapMap[category.puzzleId].set(category.id, category.name);
    });

    this.setState({puzzles: puzzleMap, categories: categoryMapMap});
  }


  public componentDidMount() {
    this.init();
  }

  private handlePuzzleChange = async (puzzleId: number) => {
    if(puzzleId <= 0) { return; }

    console.log('New puzzle', puzzleId);

    const puzzle = (await
      nSQL(SolveRepo.TABLE.PUZZLES)
        .query('select')
        .where(['id','=',puzzleId])
        .exec()
    )[0];

    this.handleCategoryChange(puzzle.categories[0]);
  };

  private handleCategoryChange = (categoryId: number) => {
    if(categoryId <= 0) { return; }

    console.log('New category', categoryId);

    Preferences.setItem('categoryId', categoryId.toString());
  };

  private handlePuzzleSelectChange = (puzzleId: string) => 
    this.handlePuzzleChange(parseInt(puzzleId,10));
  private handleCategorySelectChange = (categoryId: string) =>
    this.handleCategoryChange(parseInt(categoryId,10));


  public render() {
    return (
      <span>
        <Select
          options={this.state.puzzles}
          value={this.props.puzzle.puzzleId.toString()}
          onChange={this.handlePuzzleSelectChange}
        />

        <Select
          options={this.state.categories[this.props.puzzle.puzzleId]}
          value={this.props.puzzle.categoryId.toString()}
          onChange={this.handleCategorySelectChange}
        />
      </span>
    );
  }
}

export default PuzzleSelect;
