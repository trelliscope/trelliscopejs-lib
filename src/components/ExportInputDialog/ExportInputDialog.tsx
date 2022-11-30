import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { cogDataSelector } from '../../selectors';
import styles from './ExportInputDialog.module.scss';

// function TabPanel(props) {
//   const { children, value, index } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//     >
//       {value === index && <div>{children}</div>}
//     </div>
//   );
// }

interface ExportInputDialogProps {
  open: boolean;
  handleClose: () => void;
  displayInfo: DisplayObject;
}

interface Data {
  [key: string]: {
    [key: string]: string | null;
  };
}

const USERNAME = '__trelliscope_username';
const EMAIL = '__trelliscope_email';
const JOBTITLE = '__trelliscope_jobtitle';
const OTHERINFO = '__trelliscope_otherinfo';

const storageItems = [USERNAME, EMAIL, JOBTITLE, OTHERINFO];

const ExportInputDialog: React.FC<ExportInputDialogProps> = ({ open, handleClose, displayInfo }) => {
  const [fullName, setFullName] = useState<string>(localStorage.getItem(USERNAME) || '');
  const [email, setEmail] = useState<string>(localStorage.getItem(EMAIL) || '');
  const [jobTitle, setJobTitle] = useState<string>(localStorage.getItem(JOBTITLE) || '');
  const [otherInfo, setOtherInfo] = useState<string>(localStorage.getItem(OTHERINFO) || '');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);

  const cogData = useSelector(cogDataSelector);
  if (!cogData.isLoaded || cogData.crossfilter === undefined) {
    return null;
  }
  if (!(displayInfo.has_inputs && displayInfo.input_type === 'localStorage')) {
    return null;
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

  const handleNameChange = (event: { target: { value: string } }) => {
    setFullName(event.target.value);
    localStorage.setItem(USERNAME, event.target.value);
  };

  const handleEmailChange = (event: { target: { value: string } }) => {
    setEmail(event.target.value);
    localStorage.setItem(EMAIL, event.target.value);
  };

  const handleJobTitleChange = (event: { target: { value: string } }) => {
    setJobTitle(event.target.value);
    localStorage.setItem(JOBTITLE, event.target.value);
  };

  const handleOtherInfoChange = (event: { target: { value: string } }) => {
    setOtherInfo(event.target.value);
    localStorage.setItem(OTHERINFO, event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const ccols = displayInfo.input_csv_vars || [];
  const data = {} as Data;
  const cols = [] as string[];
  Object.keys(localStorage).forEach((key) => {
    if (storageItems.includes(key)) {
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
  const pk = cd.map((dd: CogData) => dd.panelKey);
  header.push(...['fullname', 'email', 'jobtitle', 'otherinfo', 'timestamp']);
  const rows = Object.keys(data).map((kk, ii) => {
    const rcdat = [];
    if (ccols.length > 0) {
      const idx = pk.indexOf(kk);
      rcdat.push(ccols.map((cc: string | number) => cd[idx][cc]));
    }
    const extra = [];
    if (ii === 0) {
      extra.push(
        ...[
          'values',
          `"${(localStorage.getItem(USERNAME) || '').replace(/"/g, '""')}"`,
          `"${(localStorage.getItem(EMAIL) || '').replace(/"/g, '""')}"`,
          `"${(localStorage.getItem(JOBTITLE) || '').replace(/"/g, '""')}"`,
          `"${(localStorage.getItem(OTHERINFO) || '').replace(/"/g, '""')}"`,
          new Date().toISOString(),
        ],
      );
    } else {
      extra.push(...['', '', '', '', '']);
    }
    return [...rcdat, extra];
  });

  const downloadCsv = () => {
    const csvString = [header.join(','), ...rows.map((d) => d.join(','))].join('\n');
    const csvFile = new Blob([csvString], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo.name}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
    setCsvDownloaded(true);
  };

  const clearInputs = () => {
    Object.keys(localStorage).forEach((key) => {
      if (storageItems.includes(key)) {
        localStorage.removeItem(key);
        setFullName('');
        setEmail('');
        setJobTitle('');
        setOtherInfo('');
      }
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setActiveStep(0);
          handleClose();
        }}
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
            <div className={styles.exportInputDialogContainer}>
              <DialogContentText className={styles.exportInputDialogContentText}>
                Before exporting the inputs you have provided, we would like to gather some information about you. Please
                provide at least your full name, after which you will be able to click the &apos;Export&apos; tab in this
                window to proceed with the export.
              </DialogContentText>
              <div>
                <TextField
                  className={styles.exportInputDialogTextField}
                  required
                  label="Full Name"
                  fullWidth
                  value={fullName}
                  onChange={handleNameChange}
                />
                <TextField
                  className={styles.exportInputDialogTextField}
                  label="Email Address"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                />
                <TextField
                  className={styles.exportInputDialogTextField}
                  label="Job Title"
                  fullWidth
                  value={jobTitle}
                  onChange={handleJobTitleChange}
                />
                <TextField
                  className={styles.exportInputDialogTextField}
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
                <p className={styles.exportInputDialogDescription}>
                  {`A csv file of the inputs you provided has been created. By clicking the 'Compose Email' button below, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.input_email}.`}
                </p>
                <p>
                  {`To complete the email, use the 'Download csv' button to download the csv and add it as an attachment to the email before sending. As an alternative, you can download the csv file and compose your own email, sending it to us at ${displayInfo.input_email}.`}
                </p>
              </DialogContentText>
              <div className={styles.exportInputDialogWrapperCenter}>
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.exportInputDialogButton}
                  endIcon={<FontAwesomeIcon icon={faDownload} />}
                  onClick={downloadCsv}
                >
                  Download CSV
                </Button>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <DialogContentText id="alert-dialog-description">
                <p className={styles.exportInputDialogDescription}>
                  {`By clicking the 'Compose Email' button below, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.input_email}.`}
                </p>
                <p>
                  <strong>
                    Note: You must manually attach the csv file downloaded in the previous step to this email prior to
                    sending.
                  </strong>
                </p>
              </DialogContentText>
              <div className={styles.exportInputDialogWrapperCenter}>
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.exportInputDialogButton}
                  endIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                  onClick={sendMail}
                >
                  Compose Email
                </Button>
              </div>
            </div>
          )}
          <div className={styles.exportInputDialogWrapperRight}>
            <Button disabled={activeStep === 0} onClick={handleBack} className={styles.exportInputDialogButton}>
              Back
            </Button>
            {activeStep <= 1 && (
              <Button
                disabled={(activeStep === 0 && fullName === '') || (activeStep === 1 && !csvDownloaded)}
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={styles.exportInputDialogButton}
              >
                Next
              </Button>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearInputs}>Clear all inputs</Button>
          <Button
            onClick={() => {
              setActiveStep(0);
              handleClose();
            }}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportInputDialog;
