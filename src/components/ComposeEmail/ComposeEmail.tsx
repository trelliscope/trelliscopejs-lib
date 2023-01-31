import React from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './ComposeEmail.module.scss';

interface ComposeEmailProps {
  displayInfo: IDisplay;
  sendMail: () => void;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ displayInfo, sendMail }) => (
  <div>
    <DialogContentText id="alert-dialog-description">
      <span className={styles.composeEmailDescription}>
        By clicking the &quote;Compose Email&aquote; button below, an email will be drafted and opened in your email client
        to relay this csv file back to us, at {displayInfo.inputs?.feedbackInterface.emailAddress}.
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

export default ComposeEmail;
