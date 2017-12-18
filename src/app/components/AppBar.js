// @flow

import * as React from 'react';

const AppBar = () => {
  return (
    <header className="toolbar">
      <div className="toolbar-text">
        plusTimer
      </div>

      {/* language=CSS */}
      <style jsx>{`
        .toolbar {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 56px;
          background: #3F51B5;
          box-shadow:
            0px 2px 4px -1px rgba(0,0,0,.2),
            0px 4px 5px 0px rgba(0,0,0,.14),
            0px 1px 10px 0px rgba(0,0,0,.12);
          grid-area: appbar
        }
        .toolbar-text{
          color: #fff;
          padding: 0 16px;
        }
    `}</style>
    </header>
  )
};

export default AppBar;