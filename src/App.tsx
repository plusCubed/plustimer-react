import * as React from 'react';
import './App.css';

import { TimerContainer } from './containers/TimerContainer';
import { SolvesSheetContainer } from './containers/SolvesSheetContainer';
import { SolvesGridContainer } from './containers/SolvesGridContainer';
import { ScrambleContainer } from './containers/ScrambleContainer';
import { TimerAppBarContainer } from './containers/TimerAppBarContainer';
import { SolveDialogContainer } from './containers/SolveDialogContainer';
import { StatisticsContainer } from './containers/StatisticsContainer';

import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';

const App = () => {
  return (
    <div className="App">
      <TimerAppBarContainer />

      <LayoutGrid>
        <LayoutGrid.Inner>
          <LayoutGrid.Cell cols="2">
            <div>
              <SolvesGridContainer />
            </div>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell cols="8">
            <div>
              <ScrambleContainer />

              <StatisticsContainer />

              <TimerContainer />

              <SolvesSheetContainer />

              <SolveDialogContainer />
            </div>
          </LayoutGrid.Cell>
        </LayoutGrid.Inner>
      </LayoutGrid>
    </div>
  );
};

export default App;
