import * as React from 'react';

export const Icon = (props: any) =>
  <svg
    viewBox="0 0 24 24"
    className="vertical-center-icon mdc-theme--text-primary-on-light"
    {...props}
  >
    {props.children}
  </svg>;
