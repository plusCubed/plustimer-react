import { h } from 'preact';
import Media from 'react-media';
import { connect } from 'unistore/full/preact';
import PureComponent from './PureComponent';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

import SolvesList from './SolvesList';
import { ISolve } from './SolvesList';
import Statistics from './Statistics';

import firebase from '../utils/asyncFirebase';

import style from './SolvesList.css';

// 15 minutes
const TIME_BETWEEN_SESSIONS = 15 * 60 * 1000;

const actions = store => ({
  // Pass in solves in new->old order
  async updateSessions(state, solves: ISolve[]) {
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
});

interface Props {
  uid?: string,
  puzzle?: string,
  category?: string,
  sessions?: ISolve[][],
  updateSessions?: (solves: ISolve[]) => Promise<any>
}

interface State {
  expanded: boolean
}

@connect(
  'uid,puzzle,category,sessions',
  actions
)
class SolvesListContainer extends PureComponent<Props, State> {
  public state = {
    expanded: false
  };

  public unsubscribeSolves = null;

  public async componentDidUpdate(prevProps: Props) {
    if (
      (this.props.uid !== prevProps.uid ||
        this.props.puzzle !== prevProps.puzzle ||
        this.props.category !== prevProps.category) &&
      this.props.uid &&
      this.props.puzzle &&
      this.props.category
    ) {
      this.unsubscribe();

      const firestore = await firebase.firestore(this.props.uid);
      const ref = firestore
        .collection('users')
        .doc(this.props.uid)
        .collection('puzzles')
        .doc(this.props.puzzle)
        .collection('categories')
        .doc(this.props.category)
        .collection('solves');
      this.unsubscribeSolves = ref
        .orderBy('timestamp', 'desc')
        .limit(1000)
        .onSnapshot(this.onCollectionUpdate);
    }
  }

  public onCollectionUpdate = (querySnapshot: import('firebase').firestore.QuerySnapshot) => {
    const solves: ISolve[] = [];
    querySnapshot.forEach(doc => {
      const solve = doc.data() as ISolve;
      solves.push({
        ...solve,
        id: doc.id
      });
    });

    this.props.updateSessions(solves);
  };

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public unsubscribe() {
    if (this.unsubscribeSolves) {
      this.unsubscribeSolves();
    }
  }

  public async getSolveRef(solve) {
    const firestore = await firebase.firestore(this.props.uid);
    return firestore
      .collection('users')
      .doc(this.props.uid)
      .collection('puzzles')
      .doc(this.props.puzzle)
      .collection('categories')
      .doc(this.props.category)
      .collection('solves')
      .doc(solve.id);
  }

  public handleSolvePenalty = (solve: ISolve, penalty: number) => async () => {
    if (!this.props.uid || !this.props.puzzle || !this.props.category) {
      return;
    }

    const solveRef = await this.getSolveRef(solve);

    solveRef.set({ penalty }, { merge: true });
  };

  public handleSolveDelete = (solve: ISolve) => async () => {
    if (!this.props.uid || !this.props.puzzle || !this.props.category) {
      return;
    }

    const solveRef = await this.getSolveRef(solve);
    solveRef.delete();
  };

  /*handleHistoryClick = () => {
    this.setState({ current: !this.state.current });
  };*/

  public handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  public render() {
    const sessions = this.props.sessions;

    return (
      <Media
        query="(min-width: 841px)">
        {desktop => {
          let onlyLast = !this.state.expanded;
          if(desktop){
            onlyLast = false
          }
          return (
            <div className={this.state.expanded ? style.solvesExpanded : style.solves}>
              { desktop ? <Statistics /> : null}

              <SolvesList
                onlyLast={onlyLast}
                expanded={this.state.expanded}
                sessions={sessions}
                onPenalty={this.handleSolvePenalty}
                onDelete={this.handleSolveDelete}
              />

              {!desktop  ?
                  <Button
                    onClick={this.handleExpandClick}
                    className={!this.state.expanded ? style.historyButton : style.historyButtonExpanded}
                    /*unelevated={!this.state.current}*/
                  >
                    <svg className={style.historyIcon} viewBox="0 0 24 24">
                      <path d="M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z" />
                    </svg>
                  </Button>
                :null}
            </div>
          )
        }}
      </Media>
    );
  }
}

export default SolvesListContainer;
