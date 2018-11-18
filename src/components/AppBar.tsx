import { FunctionalComponent, h } from 'preact';

import ProfileContainer from './ProfileContainer';
import PuzzleSelect from './PuzzleSelect';
import * as style from './AppBar.css';

const AppBar: FunctionalComponent<{}> = (props) => {
  return (
    <header className={style.toolbar}>

      {props.children}

      <span className={style.toolbarSpacer} />

      <ProfileContainer />
    </header>
  );
};

export default AppBar;
