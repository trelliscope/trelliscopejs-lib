import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  button: {
    margin: theme.spacing(1)
  }
}));

function TabPanel(props) {
  const {
    children, value, index
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default function ExportInputDialog({ open, handleClose, displayInfo }) {
  const classes = useStyles();

  const [fullName, setFullName] = React.useState(localStorage.getItem('__trelliscope_username') || '');
  const [email, setEmail] = React.useState(localStorage.getItem('__trelliscope_email') || '');
  const [jobTitle, setJobTitle] = React.useState(localStorage.getItem('__trelliscope_jobtitle') || '');
  const [otherInfo, setOtherInfo] = React.useState(localStorage.getItem('__trelliscope_otherinfo') || '');
  const [tabValue, setTabValue] = React.useState(fullName === '' ? 0 : 1);

  const sendMail = () => {
    const subject = 'Trelliscope input';
    const body = `From: ${fullName}%0D%0A%0D%0A\
Email: ${email}%0D%0A%0D%0A\
Job Title: ${encodeURIComponent(jobTitle)}%0D%0A%0D%0A\
Other contact info: ${encodeURIComponent(otherInfo)}%0D%0A%0D%0A\
Display: ${displayInfo.group} -> ${displayInfo.name}%0D%0A%0D%0A\
(attach downloaded csv file here before sending)`;
    const mail = document.createElement('a');
    mail.href = `mailto:${displayInfo.input_email}?subject=${subject}&body=${body}`;
    mail.click();
  };

  // localStorage.getItem('common_:_gapminder_life_expectancy_fullname')

  const id = `${displayInfo.group}_:_${displayInfo.name}`;

  const handleNameChange = (event) => {
    setFullName(event.target.value);
    localStorage.setItem('__trelliscope_username', event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    localStorage.setItem('__trelliscope_email', event.target.value);
  };

  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value);
    localStorage.setItem('__trelliscope_jobtitle', event.target.value);
  };

  const handleOtherInfoChange = (event) => {
    setOtherInfo(event.target.value);
    localStorage.setItem('__trelliscope_otherinfo', event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const keyMatch = new RegExp(`^${id}`);

  const data = {};
  const cols = [];
  Object.keys(localStorage).forEach((key) => {
    if (keyMatch.test(key)) {
      const parts = key.split('_:_');
      const panelKey = parts[2];
      if (data[panelKey] === undefined) {
        data[panelKey] = {};
      }
      data[panelKey][parts[3]] = localStorage.getItem(key);
      if (cols.indexOf(parts[3]) < 0) {
        cols.push(parts[3]);
      }
    }
  });

  const header = ['panelKey'];
  header.push(cols);
  header.push(...['fullname', 'email', 'jobtitle', 'otherinfo']);
  const rows = Object.keys(data).map((kk, ii) => {
    const row = [kk];
    row.push(cols.map((cc) => (data[kk][cc] ? data[kk][cc] : '')));
    if (ii === 0) {
      row.push(...[
        localStorage.getItem('__trelliscope_username'),
        localStorage.getItem('__trelliscope_email'),
        localStorage.getItem('__trelliscope_jobtitle'),
        localStorage.getItem('__trelliscope_otherinfo')
      ]);
    } else {
      row.push(...['', '', '', '']);
    }
    return row;
  });

  const downloadCsv = () => {
    const csvString = [header.join(','), ...rows.map((d) => d.join(','))].join('\n');
    const csvFile = new Blob([csvString], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo.name}_${(new Date()).toISOString().split('T')[0]}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
  };

  const clearInputs = () => {
    Object.keys(localStorage).forEach((key) => {
      if (keyMatch.test(key)) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Export user inputs</DialogTitle>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="disabled tabs example"
        >
          <Tab label="User Information" />
          <Tab label="Export" disabled={fullName === ''} />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <DialogContent>
            <DialogContentText>
              Before exporting the inputs you have provided, we would like to gather some
              information about you. Please provide at least your full name, after which you
              will be able to click the &apos;Export&apos; tab in this window to proceed with
              the export.
            </DialogContentText>
            <div>
              <TextField
                style={{ marginBottom: 15 }}
                required
                label="Full Name"
                fullWidth
                value={fullName}
                onChange={handleNameChange}
              />
              <TextField
                style={{ marginBottom: 15 }}
                label="Email Address"
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
              <TextField
                style={{ marginBottom: 15 }}
                label="Job Title"
                fullWidth
                value={jobTitle}
                onChange={handleJobTitleChange}
              />
              <TextField
                style={{ marginBottom: 15 }}
                multiline
                rows={3}
                label="Additional Contact Information"
                fullWidth
                value={otherInfo}
                onChange={handleOtherInfoChange}
              />
            </div>
          </DialogContent>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p style={{ marginTop: 0 }}>
                {`A csv file of the inputs you provided has been created. By clicking the 'Compose Email' button below, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.input_email}.`}
              </p>
              <p>
                {`To complete the email, use the 'Download csv' button to download the csv and add it as an attachment to the email before sending. As an alternative, you can download the csv file and compose your own email, sending it to us at ${displayInfo.input_email}.`}
              </p>

            </DialogContentText>
            <div style={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<SendIcon />}
                onClick={sendMail}
              >
                Compose Email
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<SaveIcon />}
                onClick={downloadCsv}
              >
                Download CSV
              </Button>
            </div>
            {/* <FormControl fullWidth>
              <TextField
                inputProps={{ style: {
                  fontFamily: 'courier, monospace', fontSize: 14, color: '#777'
                } }}
                id="outlined-multiline-static"
                label="csv"
                multiline
                disabled
                rows={Math.min(rows.length + 1, 10)}
                defaultValue={[header.join(','), ...rows.map((d) => d.join(','))].join('\n')}
                variant="outlined"
              />
            </FormControl> */}
          </DialogContent>
        </TabPanel>
        <DialogActions>
          <Button onClick={clearInputs}>
            Clear all inputs
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ExportInputDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  displayInfo: PropTypes.object.isRequired
};
