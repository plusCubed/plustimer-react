import * as React from 'react';
import * as textFit from 'textfit';
import { findDOMNode } from 'react-dom';

export interface TextFitSettings {
  minFontSize?: number;
  maxFontSize?: number;
  detectMultiLine?: boolean;
  multiLine?: boolean;
  reProcess?: boolean;
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  settings?: TextFitSettings;
}

export class TextFit extends React.PureComponent<Props, {}> {
  textElement: HTMLElement;

  refCallback = (element: any) => (this.textElement = element);

  handleWindowResize = () => {
    this.fitText();
  };

  innerSpanStyle = {
    display: 'inline-block'
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<{}>,
    prevContext: any
  ): void {
    this.fitText();
  }

  private fitText() {
    textFit(this.textElement, this.props.settings ? this.props.settings : {});
  }

  render() {
    const { text, ...props } = this.props;

    return (
      <div ref={this.refCallback} {...props}>
        <span className="textFitted" style={this.innerSpanStyle}>
          {text}
        </span>
      </div>
    );
  }
}
