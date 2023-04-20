import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faCopy } from '@fortawesome/free-solid-svg-icons';
import styles from './Share.module.scss';

const Share: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const url = window.location.href;
  const [copyText, setCopyText] = useState('Copy');

  const handleShareModal = () => {
    setIsOpen(!isOpen);
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
  };

  return (
    <div className={styles.share}>
      <IconButton onClick={handleShareModal}>
        <FontAwesomeIcon icon={faShareNodes} />
      </IconButton>
      <Dialog
        open={isOpen}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-info-title"
        onClose={handleShareModal}
        maxWidth="md"
      >
        <DialogTitle id="dialog-info-title">Share a link to this display</DialogTitle>
        <DialogContent>
          <div className={styles.shareContent}>
            <Tooltip title={`${copyText} to clipboard`} followCursor placement="top" arrow>
              <TextField
                className={styles.shareContentText}
                onClick={copyUrlToClipboard}
                value={url}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Tooltip>
            <Button className={styles.shareButton} aria-label="share close" color="primary" onClick={copyUrlToClipboard}>
              <FontAwesomeIcon className={styles.shareButtonIcon} icon={faCopy} />
              {copyText}
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button aria-label="share close" color="secondary" onClick={handleShareModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Share;
