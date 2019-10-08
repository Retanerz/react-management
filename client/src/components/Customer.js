/* eslint-disable react/destructuring-assignment */
import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  image: {
    height: '64px',
  },
});

class Customer extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <TableRow>
        <TableCell>{this.props.id}</TableCell>
        <TableCell><img className={classes.image} src={this.props.image} alt="profile" /></TableCell>
        <TableCell>{this.props.name}</TableCell>
        <TableCell>{this.props.birthday}</TableCell>
        <TableCell>{this.props.gender}</TableCell>
        <TableCell>{this.props.job}</TableCell>
        <TableCell>
          <CustomerDelete
            stateRefresh={this.props.stateRefresh}
            id={this.props.id}
          />
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(Customer);
