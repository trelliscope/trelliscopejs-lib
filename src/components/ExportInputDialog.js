import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';
import { cogDataSelector } from '../selectors';

// cogDataSelector

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
  const [activeStep, setActiveStep] = React.useState(0);
  const [csvDownloaded, setCsvDownloaded] = React.useState(false);

  const cogData = useSelector(cogDataSelector);
  if (!cogData.isLoaded || cogData.crossfilter === undefined) {
    return '';
  }
  if (!(displayInfo.has_inputs && displayInfo.input_type === 'localStorage')) {
    return '';
  }

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

  const steps = ['User info', 'Download csv', 'Compose email'];

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const keyMatch = new RegExp(`^${id}`);

  const ccols = displayInfo.input_csv_vars || [];
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
  // array of panel keys so we can search to get columns we need if ccols defined
  const cd = cogData.crossfilter.all();
  const pk = cd.map((dd) => dd.panelKey);
  header.push(...ccols, ...cols);
  header.push(...['fullname', 'email', 'jobtitle', 'otherinfo', 'timestamp']);
  const rows = Object.keys(data).map((kk, ii) => {
    const rcdat = [];
    if (ccols.length > 0) {
      const idx = pk.indexOf(kk);
      rcdat.push(ccols.map((cc) => cd[idx][cc]));
    }
    const rdat = cols.map((cc) => (data[kk][cc] ? `"${data[kk][cc].replace(/"/g, '""')}"` : ''));
    const extra = [];
    if (ii === 0) {
      extra.push(...[
        `"${(localStorage.getItem('__trelliscope_username') || '').replace(/"/g, '""')}"`,
        `"${(localStorage.getItem('__trelliscope_email') || '').replace(/"/g, '""')}"`,
        `"${(localStorage.getItem('__trelliscope_jobtitle') || '').replace(/"/g, '""')}"`,
        `"${(localStorage.getItem('__trelliscope_otherinfo') || '').replace(/"/g, '""')}"`,
        (new Date()).toISOString()
      ]);
    } else {
      extra.push(...['', '', '', '', '']);
    }
    return [kk, ...rcdat, rdat, extra];
  });

  const downloadCsv = () => {
    const csvString = [header.join(','), ...rows.map((d) => d.join(','))].join('\n');
    const csvFile = new Blob([csvString], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo.name}_${(new Date()).toISOString().split('T')[0]}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
    setCsvDownloaded(true);
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
        onClose={() => { setActiveStep(0); handleClose(); }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Export user inputs</DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <div>
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
            </div>
          )}
          {activeStep === 1 && (
            <div>
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
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <DialogContentText id="alert-dialog-description">
                <p style={{ marginTop: 0 }}>
                  {`By clicking the 'Compose Email' button below, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.input_email}.`}
                </p>
                <p>
                  <strong>
                    Note: You must manually attach the csv file downloaded in
                    the previous step to this email prior to sending.
                  </strong>
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
              </div>
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
            >
              Back
            </Button>
            {activeStep <= 1 && (
              <Button
                disabled={(activeStep === 0 && fullName === '') || (activeStep === 1 && !csvDownloaded)}
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearInputs}>
            Clear all inputs
          </Button>
          <Button
            onClick={() => { setActiveStep(0); handleClose(); }}
            color="primary"
            autoFocus
          >
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
