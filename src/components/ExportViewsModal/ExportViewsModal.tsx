import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import { useGetAllLocalViews } from '../../inputUtils';
import styles from './ExportViewsModal.module.scss';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

interface ExportViewsModalProps {
  isOpen: boolean;
  handleExportToggle: () => void;
}

const ExportViewsModal: React.FC<ExportViewsModalProps> = ({ isOpen, handleExportToggle }) => {
  const [exportName, setExportName] = useState('');
  const { data: displayInfo } = useDisplayInfo();
  const allLocalViews = useGetAllLocalViews() as IView[];
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleExport = () => {
    const downloadObj = {
      display: displayInfo?.name,
      views: allLocalViews,
    };

    const jsonFile = new Blob([JSON.stringify(downloadObj) as unknown as BlobPart], { type: 'json' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo?.name}_${exportName}_export_views_${new Date().toISOString().split('T')[0]}.json`;
    downloadLink.href = window.URL.createObjectURL(jsonFile);
    downloadLink.click();
    enqueueSnackbar(`View ${exportName} exported!`, {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      autoHideDuration: 3000,
    });
  };
  return (
    <div className={styles.exportViewsModal}>
      <Dialog
        PaperProps={{ sx: { backgroundColor: theme.palette.secondary.main } }}
        data-testid="export-views-modal"
        open={isOpen}
        onClose={handleExportToggle}
      >
        <DialogTitle>Export Views</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.primary.contrastText }}>
            Add a file name and download a json file of your views for this display.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <TextField
              sx={{
                // change outline color to use theme and text color contrast text
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.primary.contrastText,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.text.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-outlined': {
                  color: theme.palette.primary.contrastText,
                  '&.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
              id="name"
              data-testid="export-name-input"
              required
              autoFocus
              margin="dense"
              label="Export Name"
              fullWidth
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  e.stopPropagation();
                }
              }}
              onChange={(e) => {
                setExportName(e.target.value);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportToggle}>Cancel</Button>
          <Button data-testid="export-download-button" disabled={!exportName} onClick={handleExport}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportViewsModal;
