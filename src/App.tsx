import * as React from 'react';
import './App.css';

import { TimerContainer } from './containers/TimerContainer';
import { SolvesSheetContainer } from './containers/SolvesSheetContainer';
import { ScrambleContainer } from './containers/ScrambleContainer';
import { TimerAppBarContainer } from './containers/TimerAppBarContainer';
import { SolveDialogContainer } from './containers/SolveDialogContainer';
import { StatisticsContainer } from './containers/StatisticsContainer';

const App = () => {
  return (
    <div className="App">
      <TimerAppBarContainer />

      <ScrambleContainer />

      <StatisticsContainer />

      <TimerContainer />

      <SolvesSheetContainer />

      <SolveDialogContainer />
    </div>
  );
};

export default App;
