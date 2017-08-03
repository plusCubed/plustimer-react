import * as React from 'react';

import DialogWrapper from './DialogWrapper';

import Dialog from 'preact-material-components/Dialog';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';
import 'preact-material-components/Dialog/style.css';

import { Solve } from '../services/solves-service';
import { formatTime } from '../utils/Util';
import * as format from 'date-fns/format';

import { Icon } from './Icon';

import './SolveDialog.css';

export interface DispatchProps {
  onRequestClose: () => void;
  onDeleteClicked: (solve: Solve) => void;
}

export interface StoreStateProps {
  solve?: Solve;
  isOpen: boolean;
}

interface Props extends DispatchProps, StoreStateProps {}

const DiceIcon = (props: any) =>
  <Icon>
    <path d="M5,3H19C20.1,3 21,3.9 21,5V19C21,20.1 20.1,21 19,21H5C3.9,21 3,20.1 3,19V5C3,3.9 3.9,3 5,3M7,5C5.9,5 5,5.9 5,7C5,8.1 5.9,9 7,9C8.1,9 9,8.1 9,7C9,5.9 8.1,5 7,5M17,15C15.9,15 15,15.9 15,17C15,18.1 15.9,19 17,19C18.1,19 19,18.1 19,17C19,15.9 18.1,15 17,15M17,5C15.9,5 15,5.9 15,7C15,8.1 15.9,9 17,9C18.1,9 19,8.1 19,7C19,5.9 18.1,5 17,5M12,10C10.9,10 10,10.9 10,12C10,13.1 10.9,14 12,14C13.1,14 14,13.1 14,12C14,10.9 13.1,10 12,10M7,15C5.9,15 5,15.9 5,17C5,18.1 5.9,19 7,19C8.1,19 9,18.1 9,17C9,15.9 8.1,15 7,15Z" />
  </Icon>;

const DeleteIcon = (props: any) =>
  <Icon>
    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
  </Icon>;

const ClockIcon = (props: any) =>
  <Icon>
    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
  </Icon>;

export class SolveDialog extends React.PureComponent<Props, {}> {
  handleRequestClose = () => {
    this.props.onRequestClose();
  };

  handleDeleteClicked = () => {
    this.props.onDeleteClicked(this.props.solve!);
    this.props.onRequestClose();
  };

  render() {
    const { onRequestClose, isOpen, solve, ...other } = this.props;

    return (
      <DialogWrapper
        className="dialog"
        open={isOpen}
        onCancel={this.handleRequestClose}
        {...other}
      >
        <Dialog.Header>
          {solve ? formatTime(solve.time) : ''}
        </Dialog.Header>
        <Dialog.Body>
          <div className="dialog-row">
            <ClockIcon />
            <div className="dialog-row-text">
              {solve ? format(solve.timestamp, 'M/D/YY h:mmA') : ''}
            </div>
          </div>

          <div className="dialog-row">
            <DiceIcon />
            <div className="dialog-row-text">
              {solve ? solve.scramble : ''}
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.FooterButton
            onClick={this.handleDeleteClicked}
            ripple={false}
          >
            <DeleteIcon />
          </Dialog.FooterButton>
          <Dialog.FooterButton onClick={this.handleRequestClose} ripple={false}>
            OK
          </Dialog.FooterButton>
        </Dialog.Footer>
      </DialogWrapper>
    );
  }
}
