import { h } from 'preact';

import PureComponent from './PureComponent';
import App from '../components/App';
import { SolveRepo } from '../utils/solveRepo';
import { Preferences } from '../utils/preferences';
import { Penalty } from './SolvesList';

// NOT repo format
export interface IPuzzle {
  categoryId: number;
  puzzleId: number;
  puzzle: string,
  category: string,
  scrambler: string
}

// Repo format
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

export interface IRepoSession {
  id: number,
  categoryId: number,
  timestamp: number
}

interface IState {
  signingIn: boolean;
  updateAvailable: boolean;
  puzzle: IPuzzle;
  puzzlesReady: boolean;
  currentSessionId: number;
}

class AppWrapper extends PureComponent<void, IState> {
  public readonly state: Readonly<IState> = {
    currentSessionId: -1,
    puzzle: {categoryId: -1, puzzleId: -1, puzzle: '', category: '', scrambler: ''},
    puzzlesReady: false,
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
    const nanoSQL = await SolveRepo.onConnected();

    // Check if there are any puzzles: if not load defaults
    const rows = await nanoSQL.table(SolveRepo.TABLE.PUZZLES).query("select").exec();
    if(rows.length===0){
      try {
        const res = await import('../defaultPuzzles');
        await nanoSQL.loadJS(SolveRepo.TABLE.PUZZLES, res.default.puzzles);
        await nanoSQL.loadJS(SolveRepo.TABLE.CATEGORIES, res.default.categories);
        this.setState({puzzlesReady: true});
      }catch(e){
        console.error(e);
      }
    }else{
      this.setState({puzzlesReady: true});
    }

    // Add preferences listener for puzzle/category
    this.unsubscribePreferences = Preferences.onChange(true, 'categoryId', async (categoryIdString: string) => {
      let categoryId;
      if(!categoryIdString){
        // Default category id 1: 3x3x3 Normal
        categoryId = 1;
        Preferences.setItem('categoryId', categoryId.toString());
      }else{
        categoryId = parseInt(categoryIdString, 10);
      }

      const category = (await nanoSQL.table(SolveRepo.TABLE.CATEGORIES).query('select')
        .where(['id','=',categoryId]).exec())[0];
      const puzzle = (await nanoSQL.table(SolveRepo.TABLE.PUZZLES).query('select')
        .where(['id','=',category.puzzleId]).exec())[0];

      this.setState({puzzle: {
          category: category.name,
          categoryId: category.id,
          puzzle: puzzle.name,
          puzzleId: puzzle.id,
          scrambler: category.scrambler
        }});

      // Get latest solve session ID, default to that
      const latestSessionResult = await nanoSQL.table(SolveRepo.TABLE.SESSIONS)
        .query('select',["MAX(timestamp)"])
        .where(['categoryId', '=', category.id])
        .exec() as IRepoSession[];
      if(latestSessionResult.length === 1){
        const latestSession = latestSessionResult[0];
        this.setState({ currentSessionId: latestSession.id });
      }else{
        const newSessionId = parseInt(`${Date.now()/1000}${Math.floor(Math.random() * 10000)}`,10);

        await nanoSQL.table(SolveRepo.TABLE.SESSIONS).query('upsert', {
          id: newSessionId,
          categoryId: category.id,
          timestamp: Date.now()
        }).exec();
        this.setState({ currentSessionId: newSessionId});
      }
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
        puzzlesReady={this.state.puzzlesReady}
        currentSessionId={this.state.currentSessionId}
        signingIn={this.state.signingIn}
        updateAvailable={this.state.updateAvailable}
      />
    );
  }
}

export default AppWrapper;
