// @flow

import * as React from 'react';

import Media from 'react-media';

import style from './AppBar.css';
import tabsStyle from './Tabs.css';

type Props = {
  loggedIn: boolean,
  avatarImg: string,
  onLoginClick: () => void,
  onAvatarClick: () => void
};

const Tab = ({ active, children }) => {
  return (
    <div className={`${tabsStyle.tab} ${active ? 'active' : ''}`}>
      {children}
    </div>
  );
};

const Tabs = ({
  options,
  onTabSelected
}: {
  options: string[],
  onTabSelected: selected => void
}) => {
  return (
    <div className={tabsStyle.tabs}>
      {options.map(option => <Tab>{option}</Tab>)}
    </div>
  );
};

const AppBar = (props: Props) => {
  return (
    <header className={style.appbar}>
      <div className={style.toolbar}>
        <div className={style.toolbarText}>plusTimer</div>
        {props.loggedIn ? (
          <img
            className={style.toolbarAvatar}
            alt="User Avatar"
            src={props.avatarImg}
            onClick={props.onAvatarClick}
          />
        ) : (
          <button className={style.toolbarButton} onClick={props.onLoginClick}>
            Login
          </button>
        )}
      </div>

      <Media
        query="(max-width: 599px)"
        render={() => <Tabs options={['Timer', 'Solves']} />}
      />
    </header>
  );
};

export default AppBar;
