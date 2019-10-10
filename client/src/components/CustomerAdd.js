import React from 'react';
import { post } from 'axios';
import "react-datepicker/dist/react-datepicker.css";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

import Warning from './Warning';

const styles = theme => ({
  hidden: {
    display: 'none',
  },
  graycolor: {
    color: 'gray',
  },
  textField: {
    display: 'flex',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  genderField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
});

class CustomerAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: '',
      birthday: '',
      gender: '',
      job: '',
      fileName: '',
      warningMessage: '',
      open: false,
      warningVisibility: false
    }
  }

  showWarning = () => {
    this.setState({
      warningVisibility: true
    });
    // after 1 sec
    setTimeout(
      () => {
        this.setState({
           warningVisibility: false
          });
       }, 800
    );
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.state.file === null) {
      this.showWarning();
      this.setState({
        warningMessage: 'Please select a file',
        open: true
      });
    } else if (this.state.name === '') {
      this.showWarning();
      this.setState({
        warningMessage: 'Please enter a name',
        open: true
      });
    } else if (this.state.birthday === '') {
      this.showWarning();
      this.setState({
        warningMessage: 'Please select a date',
        open: true
      });
    } else if (this.state.gender === '') {
      this.showWarning();
      this.setState({
        warningMessage: 'Please select a gender',
        open: true
      });
    } else {
      this.addCustomer()
      .then((res) => {
        console.log(res.data);
        this.props.stateRefresh();
      });
      this.setState({
        file: null,
        name: '',
        birthday: '',
        gender: '',
        job: '',
        fileName: '',
        open: false
      });
    }
  }

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value
    });
  }

  handleDateChange = (e) => {
    this.setState({
      birthday: e.target.value
    });
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  addCustomer = () => {
    const url = '/api/customers';
    const formData = new FormData();
    formData.append('image', this.state.file);
    formData.append('name', this.state.name);
    formData.append('birthday', this.state.birthday);
    formData.append('gender', this.state.gender);
    formData.append('job', this.state.job);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return post(url, formData, config);
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.setState({
      file: null,
      name: '',
      birthday: '',
      gender: '',
      job: '',
      fileName: '',
      open: false
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Add Customer
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogContent  style={{width: "250px", height: "355px"}}>
          <Warning visible={this.state.warningVisibility} message={this.state.warningMessage}/>
            <input className={classes.hidden}
              accept="image/*"
              id="raised-button-file"
              type="file"
              file={this.state.file}
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                className={classes.textField}
                variant="contained"
                color="primary"
                component="span"
                name="file"
                > {this.state.fileName === "" ? "Select Image" : this.state.fileName}
              </Button>
            </label>
            <br />
            <TextField
              className={classes.textField}
              label="Name"
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              className={classes.textField}
              label="Birthday"
              type="date"
              name="birthday"
              Defaultvalue={this.state.birthday}
              value={this.state.birthday}
              onChange={this.handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <FormControl component="fieldset" className={classes.genderField}>
              <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  className={classes.genderField}
                  aria-label="gender"
                  name="gender"
                  value={this.state.gender}
                  onChange={this.handleValueChange}
                  row
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio color="primary" />}
                    label="Male"
                    labelPlacement="end"
                  />
                </RadioGroup>
            </FormControl>
            <TextField
              className={classes.textField}
              label="Job"
              type="text"
              name="job"
              value={this.state.job}
              onChange={this.handleValueChange}
            />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerAdd);