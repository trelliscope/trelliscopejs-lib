import React from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import styles from './DownloadCsv.module.scss';

interface DownloadCsvProps {
  displayInfo: DisplayObject;
  downloadCsv: () => void;
}

const DownloadCsv: React.FC<DownloadCsvProps> = ({ displayInfo, downloadCsv }) => (
  <div>
    <DialogContentText id="alert-dialog-description">
      <span className={styles.downloadCsvDescription}>
        {`A csv file of the inputs you provided has been created. By clicking the 'Compose Email' on the next step, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.input_email}.`}
      </span>
      <span>
        {`To complete the email, use the 'Download csv' button to download the csv and add it as an attachment to the email before sending. As an alternative, you can download the csv file and compose your own email, sending it to us at ${displayInfo.input_email}.`}
      </span>
    </DialogContentText>
    <div className={styles.downloadCsvWrapperCenter}>
      <Button
        variant="contained"
        color="primary"
        className={styles.downloadCsvButton}
        endIcon={<FontAwesomeIcon icon={faDownload} />}
        onClick={downloadCsv}
      >
        Download CSV
      </Button>
    </div>
  </div>
);

export default DownloadCsv;
