import React, { useState } from 'react';
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

interface ExportInputDialogProps {
  open: boolean;
  handleClose: () => void;
  displayInfo: IDisplay;
  hasInputs: boolean;
  hasLocalStorage: boolean;
}

const USERNAME = '__trelliscope_username';
const EMAIL = '__trelliscope_email';
const JOBTITLE = '__trelliscope_jobtitle';
const OTHERINFO = '__trelliscope_otherinfo';

const storageItems: [string, string, string, string] = [USERNAME, EMAIL, JOBTITLE, OTHERINFO];

const ExportInputDialog: React.FC<ExportInputDialogProps> = ({
  open,
  handleClose,
  displayInfo,
  hasInputs,
  hasLocalStorage,
}) => {
  const [fullName, setFullName] = useState<string>(localStorage.getItem(USERNAME) || '');
  const [email, setEmail] = useState<string>(localStorage.getItem(EMAIL) || '');
  const [jobTitle, setJobTitle] = useState<string>(localStorage.getItem(JOBTITLE) || '');
  const [otherInfo, setOtherInfo] = useState<string>(localStorage.getItem(OTHERINFO) || '');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState(true);

  if (!(hasInputs && hasLocalStorage)) {
    return null;
  }

  const steps = ['User info', 'Download csv', 'Compose email'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const clearInputs = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.includes(displayInfo.name) || storageItems.includes(key)) {
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
              setValidEmail={setValidEmail}
              setFullName={setFullName}
              setEmail={setEmail}
              setJobTitle={setJobTitle}
              setOtherInfo={setOtherInfo}
              storageItems={storageItems}
            />
          )}
          {activeStep === 1 && (
            <DownloadCsv
              displayInfo={displayInfo}
              setCsvDownloaded={setCsvDownloaded}
              fullName={fullName}
              email={email}
              jobTitle={jobTitle}
            />
          )}
          {activeStep === 2 && (
            <ComposeEmail
              displayInfo={displayInfo}
              fullName={fullName}
              email={email}
              jobTitle={jobTitle}
              otherInfo={otherInfo}
            />
          )}
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
