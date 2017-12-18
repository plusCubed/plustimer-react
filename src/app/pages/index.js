// @flow

import * as React from 'react';

import AppBar from "../components/AppBar";
import TimerDisplay from "../components/TimerDisplay";

export default () => (
  <div className="page">
    <AppBar />

    <TimerDisplay />

    {/* language=CSS */}
    <style jsx>{`
      .page{
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          'appbar appbar'
          'solves timer';
      }
    `}</style>

    {/* language=CSS */}
    <style global jsx>{`
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      }
    `}</style>
  </div>
);
