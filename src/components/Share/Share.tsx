import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faCopy } from '@fortawesome/free-solid-svg-icons';
import styles from './Share.module.scss';
import { useConfig } from '../../slices/configAPI';

const Share: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const url = window.location.href;
  const [copyText, setCopyText] = useState('Copy');
  const { data: configObj } = useConfig();

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
      <Tooltip title="Share">
        <IconButton data-testid="share-button" onClick={handleShareModal}>
          <FontAwesomeIcon
            color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
            icon={faShareNodes}
          />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isOpen}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-info-title"
        onClose={handleShareModal}
        maxWidth="md"
        data-testid="share-modal"
      >
        <DialogTitle id="dialog-info-title">Share a link to this display</DialogTitle>
        <DialogContent>
          <div className={styles.shareContent}>
            <Tooltip data-testid="share-tooltip" title={`${copyText} to clipboard`} followCursor placement="top" arrow>
              <TextField
                data-testid="share-url"
                className={styles.shareContentText}
                onClick={copyUrlToClipboard}
                value={url}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Tooltip>
            <Button
              data-testid="copy-button"
              className={styles.shareButton}
              aria-label="share close"
              color="primary"
              onClick={copyUrlToClipboard}
            >
              <FontAwesomeIcon className={styles.shareButtonIcon} icon={faCopy} />
              {copyText}
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button data-testid="share-close" aria-label="share close" onClick={handleShareModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Share;
