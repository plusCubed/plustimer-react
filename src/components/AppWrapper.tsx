import { h } from 'preact';
import { nSQL } from 'nano-sql';

import PureComponent from './PureComponent';
import App from '../components/App';
import * as preferences from '../utils/preferences';
import { SolveRepo } from '../utils/solveRepo';

interface IState {
  signingIn: boolean;
  updateAvailable: boolean;
  puzzle: IPuzzle;
}

export interface IPuzzle {
  categoryId: number;
  puzzleId: number;
  puzzle: string,
  category: string,
  scrambler: string
}

export interface ISolve{
  id: number,
  categoryId: number,
  puzzleId: number,
  sessionId: number,
  timestamp: number,
  penalty: number,
  time: number,
  scramble: string
}

class AppWrapper extends PureComponent<void, IState> {
  public readonly state = {
    puzzle: {categoryId: 0, puzzleId: 0, puzzle: '', category: '', scrambler: ''},
    signingIn: false,
    updateAvailable: false
  };

  constructor(props) {
    super(props);

    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.ADD_SW &&
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      navigator.serviceWorker.controller.onstatechange = event => {
        if ((event.target as any).state === 'redundant') {
          this.setState({ updateAvailable: true });
        }
      };
    }
  }

  public async componentDidMount() {
    SolveRepo.init();
    await SolveRepo.onConnected();

    const rows = await nSQL(SolveRepo.TABLE.PUZZLES).query("select").exec();
    if(rows.length===0){
      try {
        const res = await import('../defaultPuzzles');
        await nSQL().loadJS(SolveRepo.TABLE.PUZZLES, res.default.puzzles);
        await nSQL().loadJS(SolveRepo.TABLE.CATEGORIES, res.default.categories);
      }catch(e){
        console.error(e);
      }
    }

    const categoryIdString = preferences.getItem('categoryId');
    let categoryId;
    if(!categoryIdString){
      // Default category id 1: 3x3x3 Normal
      categoryId = 1;
      preferences.setItem('categoryId', categoryId.toString());
    }else{
      categoryId = parseInt(categoryIdString, 10);
    }

    const category = (await nSQL(SolveRepo.TABLE.CATEGORIES).query('select').where(['id','=',categoryId]).exec())[0];
    const puzzle = (await nSQL(SolveRepo.TABLE.PUZZLES).query('select').where(['id','=',category.puzzleId]).exec())[0];
    
    this.setState({puzzle: {
      category: category.name,
      categoryId: category.id, 
      puzzle: puzzle.name,
      puzzleId: puzzle.id,
      scrambler: category.scrambler
    }});
  }

  public componentWillUnmount() {}

  public render() {
    return (
      <App
        puzzle={this.state.puzzle}
        signingIn={this.state.signingIn}
        updateAvailable={this.state.updateAvailable}
      />
    );
  }
}

export default AppWrapper;
