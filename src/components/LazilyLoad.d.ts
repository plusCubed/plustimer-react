import * as React from 'react';

interface Props {
  modules?: any;
}

export default class LazilyLoad extends React.Component<Props, {}> {}

export const importLazy: (promise: Promise<any>) => any;
