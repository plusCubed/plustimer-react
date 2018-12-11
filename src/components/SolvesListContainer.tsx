import { h } from 'preact';
import Media from 'react-media';
import PureComponent from './PureComponent';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

import SolvesList from './SolvesList';
import Statistics from './Statistics';

import style from './SolvesList.css';
import { IPuzzle, ISolve } from './AppWrapper';
import { SolveRepo } from '../utils/solveRepo';
import { DatabaseEvent } from 'nano-sql';

// 15 minutes
//const TIME_BETWEEN_SESSIONS = 15 * 60 * 1000;

/*const actions = store => ({
  // Pass in solves in new->old order
  async updateSessions(state, solves: IRepoSolve[]) {
    let timestamp = Date.now();
    let sessionIndex = 0;
    const sessions = [[]];
    solves.forEach((solve, index) => {
      if (timestamp - solve.timestamp > TIME_BETWEEN_SESSIONS) {
        sessions.push([]);
        sessionIndex++;
      }
      sessions[sessionIndex].push(solve);
      timestamp = solve.timestamp;
    });
    store.setState({ sessions });
  }
});*/

interface Props {
  //uid?: string,
  puzzle: IPuzzle,
  //category?: string,
  //sessions?: IRepoSolve[][],
  // updateSessions?: (solves: IRepoSolve[]) => Promise<any>
}

interface State {
  expanded: boolean,
  solves: ISolve[]
}

class SolvesListContainer extends PureComponent<Props, State> {
  public state = {
    expanded: false,
    solves: []
  };

  //public unsubscribeSolves = null;
  
  public onSolvesChange = null;

  public async componentDidUpdate(prevProps: Props) {
    const { puzzle } = this.props;

    if (puzzle.categoryId !== prevProps.puzzle.categoryId
      && puzzle.categoryId) {
      await SolveRepo.onConnected();

      this.unsubscribe();

      const solves = (await (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES))
        .query('select')
        .where(['categoryId', '=', puzzle.categoryId])
        .exec()) as ISolve[];
      this.setState({ solves });

      this.onSolvesChange = (event: DatabaseEvent) => {
        event.affectedRows.forEach((row) => {
          if (row.categoryId !== puzzle.categoryId) {
            return;
          }

          if(event.types.includes('upsert')) {
            let foundIndex = -1;
            for(let i = 0; i<this.state.solves.length; i++){
              const solve = this.state.solves[i];
              if(solve.id === row.id){
                foundIndex = i;
                break;
              }
            }

            const newSolves = this.state.solves.slice();
            if (foundIndex!==-1) {
              newSolves[foundIndex] = row;
            } else {
              newSolves.push(row);
            }

            this.setState({ solves: newSolves });
          } else if(event.types.includes('delete')) {
            const newSolves = this.state.solves.slice()
              .filter((solve) => solve.id !== row.id);
            this.setState({ solves: newSolves });
          }

        });
      };

      (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES)).on('change', this.onSolvesChange);
    }
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public async unsubscribe() {
    if(this.onSolvesChange) {
      (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES)).off('change', this.onSolvesChange);
    }
  }

  public handleSolvePenalty = (solve: ISolve, penalty: number) => async () => {
    await SolveRepo.onConnected();

    await (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES))
      .query('upsert', {penalty})
      .where(['id','=',solve.id])
      .exec();
  };

  public handleSolveDelete = (solve: ISolve) => async () => {
    await SolveRepo.onConnected();

    await (await SolveRepo.nSQL(SolveRepo.TABLE.SOLVES))
      .query('delete')
      .where(['id','=',solve.id])
      .exec();
  };

  public handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  public render() {
    const {expanded, solves} = this.state;
    const solvesReversed = solves.slice().reverse();
    return (
      <Media
        query="(min-width: 841px)">
        {desktop => {
          let onlyLast = !expanded;
          if(desktop){
            onlyLast = false;
          }
          return (
            <div className={expanded ? style.solvesExpanded : style.solves}>
              { desktop ? <Statistics /> : null}

              <SolvesList
                onlyLast={onlyLast}
                expanded={expanded}
                solves={solvesReversed}
                onPenalty={this.handleSolvePenalty}
                onDelete={this.handleSolveDelete}
              />

              {!desktop  ?
                <Button
                  onClick={this.handleExpandClick}
                  className={!expanded ? style.historyButton : style.historyButtonExpanded}
                >
                  <svg className={style.historyIcon} viewBox="0 0 24 24">
                    <path d="M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z" />
                  </svg>
                </Button>
              :null}
            </div>
          );
        }}
      </Media>
    );
  }
}

export default SolvesListContainer;
