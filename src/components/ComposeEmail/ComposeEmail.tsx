import React from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './ComposeEmail.module.scss';

interface ComposeEmailProps {
  displayInfo: DisplayObject;
  sendMail: () => void;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ displayInfo, sendMail }) => (
  <div>
    <DialogContentText id="alert-dialog-description">
      <p className={styles.composeEmailDescription}>
        {`By clicking the 'Compose Email' button below, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.input_email}.`}
      </p>
      <p>
        <strong>
          Note: You must manually attach the csv file downloaded in the previous step to this email prior to sending.
        </strong>
      </p>
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