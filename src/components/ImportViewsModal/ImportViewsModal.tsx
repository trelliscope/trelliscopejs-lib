import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';

import { useSnackbar } from 'notistack';
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ImportViewsModal.module.scss';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

interface ImportViewsModalProps {
  isOpen: boolean;
  handleImportToggle: () => void;
}

const ImportViewsModal: React.FC<ImportViewsModalProps> = ({ isOpen, handleImportToggle }) => {
  const { data: displayInfo } = useDisplayInfo();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const { views } = JSON.parse(text);
        if (!views) {
          setIsLoading(false);
          enqueueSnackbar('Error reading file, please make sure the file is an exported json file.', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            autoHideDuration: 3000,
          });
          handleImportToggle();
          return;
        }

        views.forEach((view: IView) => {
          // if view doesnt already exist in the local storage add it
          if (!localStorage.getItem(`_:_${displayInfo?.name || ''}_:_trelliscope_views_:_${view.name}`)) {
            localStorage.setItem(
              `_:_${displayInfo?.name || ''}_:_trelliscope_views_:_${view.name}`,
              JSON.stringify({
                ...view,
              }),
            );
          }
        });

        setIsLoading(false);

        handleImportToggle();
        enqueueSnackbar(`${displayInfo?.name} views updated successfully `, {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          autoHideDuration: 3000,
        });
      };

      reader.onerror = (event) => {
        setIsLoading(false);
        enqueueSnackbar('Error reading file', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          autoHideDuration: 3000,
        });
      };
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.importViewsModal}>
      <Dialog open={isOpen} onClose={handleImportToggle}>
        <DialogTitle>Import Views</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Import views by uploading a json file below. If a view already exists with the same name it will be skipped.
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <label htmlFor="button-file">
              <Button
                disabled={isLoading}
                variant="outlined"
                component="span"
                startIcon={<FontAwesomeIcon icon={faFileArrowUp} />}
              >
                {isLoading ? 'Loading...' : 'Upload'}
              </Button>
              <input accept=".json" style={{ display: 'none' }} id="button-file" type="file" onChange={handleFileInput} />
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportToggle}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImportViewsModal;
