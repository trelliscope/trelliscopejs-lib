import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faClipboard, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

interface ErrorSnackInterface {
  errorMsg: string;
  handleClose: () => void;
  errorInfo: string;
}

const ErrorSnack: React.FC<ErrorSnackInterface> = ({ errorMsg, errorInfo, handleClose }) => {
  const [copyText, setCopyText] = useState('Copy');

  const { data: displayInfo } = useDisplayInfo();

  const url = window.location.href;

  const copyErrorToClipboard = () => {
    navigator.clipboard.writeText(`Error: ${errorMsg}\n INFO: ${errorInfo}\n URL: ${url}`);
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
  };

  const handleSendEmail = () => {
    const subject = 'Trelliscope Error Report';
    const body = encodeURIComponent(
      `Display: ${displayInfo?.name} \n Error: ${errorMsg}\n INFO: ${errorInfo}\n URL: ${url}`,
    );
    const mail = document.createElement('a');
    mail.href = `mailto:${displayInfo?.inputs?.feedbackInterface.feedbackEmail}?subject=${subject}&body=${body}`;
    mail.click();
  };

  const handleRefresh = () => {
    const host = window.location.origin;
    window.location.replace(host);
  };

  return (
    <Snackbar
      ContentProps={{ sx: { backgroundColor: 'white' } }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={errorMsg !== ''}
      onClose={handleClose}
      message={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1">The following error has occurred:</Typography>
          <Typography sx={{ color: 'red', ml: 1 }}>{errorMsg}</Typography>
        </Box>
      }
      action={[
        <Button key="copy" size="small" onClick={copyErrorToClipboard} startIcon={<FontAwesomeIcon icon={faClipboard} />}>
          {copyText}
        </Button>,
        <Button key="email" size="small" onClick={handleSendEmail} startIcon={<FontAwesomeIcon icon={faPaperPlane} />}>
          Email
        </Button>,
        <Button key="refresh" size="small" onClick={handleRefresh} startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}>
          Refresh
        </Button>,
        <Button key="close" size="small" onClick={handleClose} startIcon={<FontAwesomeIcon icon={faXmark} />}>
          Close
        </Button>,
      ]}
    />
  );
};

export default ErrorSnack;
