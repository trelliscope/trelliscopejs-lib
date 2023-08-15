import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Step, StepLabel, Stepper, Tooltip } from '@mui/material';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserInfo from '../UserInfo';
import DownloadCsv from '../DownloadCsv';
import ComposeEmail from '../ComposeEmail';
import ConfirmationModal from '../ConfirmationModal';
import styles from './ExportInputDialog.module.scss';

interface ExportInputDialogProps {
  displayInfo: IDisplay;
  hasInputs: boolean;
  hasLocalStorage: boolean;
}

const USERNAME = '__trelliscope_username';
const EMAIL = '__trelliscope_email';
const JOBTITLE = '__trelliscope_jobtitle';
const OTHERINFO = '__trelliscope_otherinfo';

const storageItems: [string, string, string, string] = [USERNAME, EMAIL, JOBTITLE, OTHERINFO];

const ExportInputDialog: React.FC<ExportInputDialogProps> = ({ displayInfo, hasInputs, hasLocalStorage }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(localStorage.getItem(USERNAME) || '');
  const [email, setEmail] = useState<string>(localStorage.getItem(EMAIL) || '');
  const [jobTitle, setJobTitle] = useState<string>(localStorage.getItem(JOBTITLE) || '');
  const [otherInfo, setOtherInfo] = useState<string>(localStorage.getItem(OTHERINFO) || '');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState(true);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const hasEmail = !!displayInfo?.inputs?.feedbackInterface?.feedbackEmail || false;

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
      if ((key.includes(displayInfo.name) || storageItems.includes(key)) && !key.includes('_trelliscope_views_')) {
        localStorage.removeItem(key);
      }
      setFullName('');
      setEmail('');
      setJobTitle('');
      setOtherInfo('');
      setValidEmail(true);
      setActiveStep(0);
    });
  };

  const handleConfirm = () => {
    setConfirmationModalOpen(false);
    clearInputs();
  };

  const handleCancel = () => {
    setConfirmationModalOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Tooltip title="Export Inputs">
        <IconButton data-testid="export-button" aria-label="close" onClick={handleOpen}>
          <FontAwesomeIcon icon={faFileArrowDown} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          handleClose();
          setTimeout(() => {
            setActiveStep(0);
          }, 500);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-testid="export-input-dialog"
      >
        <DialogTitle id="alert-dialog-title">Export user inputs</DialogTitle>
        <DialogContent dividers>
          {hasEmail ? (
            <>
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
                  hasEmail={hasEmail}
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
            </>
          ) : (
            <DownloadCsv
              displayInfo={displayInfo}
              setCsvDownloaded={setCsvDownloaded}
              fullName={fullName}
              email={email}
              jobTitle={jobTitle}
              hasEmail={hasEmail}
            />
          )}
        </DialogContent>
        <div className={styles.exportInputDialogControlsContainer}>
          <Button data-testid="export-input-clear" onClick={() => setConfirmationModalOpen(true)}>
            Clear inputs
          </Button>
          <ConfirmationModal
            isOpen={confirmationModalOpen}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            dialogText="This will delete all local storage input items on all panels."
          />
          {hasEmail && (
            <div className={styles.exportInputDialogControlsContainerStepper}>
              <Button
                data-testid="export-input-back"
                disabled={activeStep === 0}
                onClick={handleBack}
                className={styles.exportInputDialogButton}
              >
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
                  data-testid="export-input-next"
                >
                  Next
                </Button>
              )}
            </div>
          )}

          <Button
            onClick={() => {
              handleClose();
              setTimeout(() => {
                setActiveStep(0);
              }, 500);
            }}
            color="primary"
            autoFocus
            data-testid="export-input-close"
          >
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ExportInputDialog;
