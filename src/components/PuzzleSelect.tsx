import { h } from 'preact';

import PureComponent from './PureComponent';

import Select from './Select';

import { Preferences } from '../utils/preferences';
import { IPuzzle } from './AppWrapper';
import { SolveRepo } from '../utils/solveRepo';

interface IProps {
  puzzle: IPuzzle;
  puzzlesReady: boolean;
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


  public componentDidUpdate(previousProps: Readonly<IProps>, previousState: Readonly<IState>, previousContext: any): void {
    if(!previousProps.puzzlesReady && this.props.puzzlesReady){
      this.updatePuzzles();
    }
  }

  private async updatePuzzles() {
    await SolveRepo.onConnected();

    const puzzles = await (await SolveRepo.nSQL(SolveRepo.TABLE.PUZZLES))
      .query('select')
      .orderBy({'name': 'asc'})
      .exec();

    const puzzleMap = new Map;
    puzzles.forEach(puzzle => {
      puzzleMap.set(puzzle.id, puzzle.name);
    });

    const categories = await (await SolveRepo.nSQL(SolveRepo.TABLE.CATEGORIES))
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

  private handlePuzzleChange = async (puzzleId: number) => {
    if(puzzleId <= 0) { return; }

    console.log('New puzzle', puzzleId);

    const puzzle = (await
      (await SolveRepo.nSQL(SolveRepo.TABLE.PUZZLES))
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
