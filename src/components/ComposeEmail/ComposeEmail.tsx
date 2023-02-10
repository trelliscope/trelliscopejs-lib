import React from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './ComposeEmail.module.scss';

interface ComposeEmailProps {
  displayInfo: IDisplay;
  fullName: string;
  email: string;
  jobTitle: string;
  otherInfo: string;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ displayInfo, fullName, email, jobTitle, otherInfo }) => {
  const sendMail = () => {
    const subject = 'Trelliscope input';
    const body = `From: ${fullName}%0D%0A%0D%0A\
    Email: ${email}%0D%0A%0D%0A\
    Name: ${fullName}%0D%0A%0D%0A\
    Job Title: ${encodeURIComponent(jobTitle)}%0D%0A%0D%0A\
    Other contact info: ${encodeURIComponent(otherInfo)}%0D%0A%0D%0A\
    Display: ${displayInfo.tags} -> ${displayInfo.name}%0D%0A%0D%0A\
    (attach downloaded csv file here before sending)`;
    const mail = document.createElement('a');
    mail.href = `mailto:${displayInfo.inputs?.feedbackInterface.feedbackEmail}?subject=${subject}&body=${body}`;
    mail.click();
  };

  return (
    <div>
      <DialogContentText id="alert-dialog-description">
        <span className={styles.composeEmailDescription}>
          By clicking the &quote;Compose Email&aquote; button below, an email will be drafted and opened in your email client
          to relay this csv file back to us, at {displayInfo.inputs?.feedbackInterface.feedbackEmail}.
        </span>
        <span className={styles.composeEmailDescription}>
          <strong>
            Note: You must manually attach the csv file downloaded in the previous step to this email prior to sending.
          </strong>
        </span>
      </DialogContentText>
      <div className={styles.composeEmailWrapperCenter}>
        <Button
          variant="contained"
          color="primary"
          className={styles.composeEmailButton}
          endIcon={<FontAwesomeIcon icon={faPaperPlane} />}
          onClick={sendMail}
        >
          Compose Email
        </Button>
      </div>
    </div>
  );
};

export default ComposeEmail;
