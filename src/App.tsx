import * as React from 'react';
import './App.css';

import { CurrentTimer } from './containers/CurrentTimer';
import { CurrentSolvesSheet } from './containers/CurrentSolvesSheet';
import { CurrentScramble } from './containers/CurrentScramble';
import { CurrentTimerAppBar } from './containers/CurrentTimerAppBar';
import { CurrentSolveDialog } from './containers/CurrentSolveDialog';
import { CurrentStatistics } from './containers/CurrentStatistics';

const App = () => {
  return (
    <div className="App">
      <CurrentTimerAppBar />

      <CurrentScramble />

      <CurrentStatistics />

      <CurrentTimer />

      <CurrentSolvesSheet />

      <CurrentSolveDialog />
    </div>
  );
};

export default App;
