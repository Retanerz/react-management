import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  buttonWidth: {
    marginBottom: '5px',
    width: '80px',
  }
});

class CustomerDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  deleteCustomer = (id) => {
    const url = '/api/customers/' + id;
    fetch(url, {
      method: 'DELETE'
    });
    this.props.stateRefresh();
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  }
  
  handleClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button 
          className={classes.buttonWidth}
          variant="contained"
          color="secondary"
          onClick={this.handleClickOpen}
        >
          DELETE
        </Button>
        <Dialog onClose={this.handleClose} open={this.state.open}>
            <DialogTitle onClose={this.handleClose}>
              Notification
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                The selected customer information will be deleted.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  (e) => {this.deleteCustomer(this.props.id)}
                }
              >
                DELETE
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleClose}
              >
                CLOSE
              </Button>
            </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(CustomerDelete);