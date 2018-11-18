import { h } from 'preact';

import PureComponent from './PureComponent';
import App from '../components/App';
import { SolveRepo } from '../utils/solveRepo';
import { Preferences } from '../utils/preferences';

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
    puzzle: {categoryId: -1, puzzleId: -1, puzzle: '', category: '', scrambler: ''},
    signingIn: false,
    updateAvailable: false
  };

  private unsubscribePreferences: ()=>void;

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

    const nanoSQLPuzzles = await SolveRepo.nSQL(SolveRepo.TABLE.PUZZLES);
    const rows = await nanoSQLPuzzles.query("select").exec();
    if(rows.length===0){
      try {
        const res = await import('../defaultPuzzles');
        const nanoSQL = await SolveRepo.nSQL();
        await nanoSQL.loadJS(SolveRepo.TABLE.PUZZLES, res.default.puzzles);
        await nanoSQL.loadJS(SolveRepo.TABLE.CATEGORIES, res.default.categories);
      }catch(e){
        console.error(e);
      }
    }

    this.unsubscribePreferences = Preferences.onChange(true, 'categoryId', async (categoryIdString: string) => {
      let categoryId;
      if(!categoryIdString){
        // Default category id 1: 3x3x3 Normal
        categoryId = 1;
        Preferences.setItem('categoryId', categoryId.toString());
      }else{
        categoryId = parseInt(categoryIdString, 10);
      }

      const nanoSQLCategories = await SolveRepo.nSQL(SolveRepo.TABLE.CATEGORIES);
      const category = (await nanoSQLCategories.query('select').where(['id','=',categoryId]).exec())[0];
      const puzzle = (await nanoSQLPuzzles.query('select').where(['id','=',category.puzzleId]).exec())[0];

      this.setState({puzzle: {
          category: category.name,
          categoryId: category.id,
          puzzle: puzzle.name,
          puzzleId: puzzle.id,
          scrambler: category.scrambler
        }});
    });
  }

  public componentWillUnmount() {
    if(this.unsubscribePreferences){
      this.unsubscribePreferences();
    }
  }

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
