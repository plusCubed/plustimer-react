import * as React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import { Solve } from '../services/solves-service';
import { formatTime } from '../utils/Util';

interface Props {
  onRequestClose: () => void;
  solve: Solve;
  open: boolean;
}

export default class SolveDialog extends React.PureComponent<Props, {}> {
  handleRequestClose = () => {
    this.props.onRequestClose();
  };

  render() {
    const { onRequestClose, solve, ...other } = this.props;

    return (
      <Dialog onRequestClose={this.handleRequestClose} {...other}>
        <DialogTitle>
          {solve ? formatTime(solve.time) : ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>asdfasdfasdfasdf</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
