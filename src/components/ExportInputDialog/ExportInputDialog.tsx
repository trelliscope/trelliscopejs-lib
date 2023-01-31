import React, { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import UserInfo from '../UserInfo';
import DownloadCsv from '../DownloadCsv';
import ComposeEmail from '../ComposeEmail';
import styles from './ExportInputDialog.module.scss';
import { DataContext } from '../DataProvider';

interface ExportInputDialogProps {
  open: boolean;
  handleClose: () => void;
  displayInfo: IDisplay;
  hasInputs: boolean;
  hasLocalStorage: boolean;
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

const ExportInputDialog: React.FC<ExportInputDialogProps> = ({
  open,
  handleClose,
  displayInfo,
  hasInputs,
  hasLocalStorage,
}) => {
  const { allData } = useContext(DataContext);
  const [fullName, setFullName] = useState<string>(localStorage.getItem(USERNAME) || '');
  const [email, setEmail] = useState<string>(localStorage.getItem(EMAIL) || '');
  const [jobTitle, setJobTitle] = useState<string>(localStorage.getItem(JOBTITLE) || '');
  const [otherInfo, setOtherInfo] = useState<string>(localStorage.getItem(OTHERINFO) || '');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState(true);
  const emailRegex =
    /^[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!(hasInputs && hasLocalStorage)) {
    return null;
  }

  const sendMail = () => {
    const subject = 'Trelliscope input';
    const body = `From: ${fullName}%0D%0A%0D%0A\
    Email: ${email}%0D%0A%0D%0A\
    Job Title: ${encodeURIComponent(jobTitle)}%0D%0A%0D%0A\
    Other contact info: ${encodeURIComponent(otherInfo)}%0D%0A%0D%0A\
    Display: ${displayInfo.tags} -> ${displayInfo.name}%0D%0A%0D%0A\
    (attach downloaded csv file here before sending)`;
    const mail = document.createElement('a');
    mail.href = `mailto:${displayInfo.inputs?.feedbackInterface.emailAddress}?subject=${subject}&body=${body}`;
    mail.click();
  };

  const steps = ['User info', 'Download csv', 'Compose email'];

  const handleValidateEmail = (emailInput: string) => {
    if (emailRegex.test(emailInput) || emailInput === '') {
      setValidEmail(true);
      localStorage.setItem(EMAIL, emailInput);
    } else {
      setValidEmail(false);
    }
  };

  const handleNameChange = (event: { target: { value: string } }) => {
    setFullName(event.target.value);
    localStorage.setItem(USERNAME, event.target.value);
  };

  const handleEmailChange = (event: { target: { value: string } }) => {
    handleValidateEmail(event.target.value);
    setEmail(event.target.value);
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

  const ccols = displayInfo.inputs?.feedbackInterface.includeMetaVars || [];
  const data = {} as Data;
  const cols = [] as string[];
  // TODO currently this doesnt work since data is never set to anything.
  // We should also look at using lodash getOR to safely get values from nested objects
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
  const cd = allData;
  const pk = cd.map((dd) => dd.__PANEL_KEY__);
  header.push(...['fullname', 'email', 'jobtitle', 'otherinfo', 'timestamp']);
  const rows = Object.keys(data).map((kk, ii) => {
    const rcdat = [];
    if (ccols.length > 0) {
      const idx = pk.indexOf(kk);
      // TODO if we use lodash getor, we could simplify this to not have an if statement checking if idx is > -1
      // The problem is if the we pull an undefined value from cd, it will throw an error
      if (idx > -1) {
        rcdat.push(ccols.map((cc: string | number) => cd[idx][cc]));
      }
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
      }
      setFullName('');
      setEmail('');
      setJobTitle('');
      setOtherInfo('');
      setValidEmail(true);
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
            <UserInfo
              fullName={fullName}
              email={email}
              jobTitle={jobTitle}
              otherInfo={otherInfo}
              validEmail={validEmail}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              handleJobTitleChange={handleJobTitleChange}
              handleOtherInfoChange={handleOtherInfoChange}
            />
          )}
          {activeStep === 1 && <DownloadCsv displayInfo={displayInfo} downloadCsv={downloadCsv} />}
          {activeStep === 2 && <ComposeEmail displayInfo={displayInfo} sendMail={sendMail} />}
        </DialogContent>
        <div className={styles.exportInputDialogControlsContainer}>
          <Button onClick={clearInputs}>Clear inputs</Button>
          <div className={styles.exportInputDialogControlsContainerStepper}>
            <Button disabled={activeStep === 0} onClick={handleBack} className={styles.exportInputDialogButton}>
              Back
            </Button>
            {activeStep <= 1 && (
              <Button
                disabled={
                  (activeStep === 0 && fullName === '') ||
                  (activeStep === 0 && !validEmail) ||
                  (activeStep === 1 && !csvDownloaded)
                }
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={styles.exportInputDialogButton}
              >
                Next
              </Button>
            )}
          </div>
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
        </div>
      </Dialog>
    </div>
  );
};

export default ExportInputDialog;
