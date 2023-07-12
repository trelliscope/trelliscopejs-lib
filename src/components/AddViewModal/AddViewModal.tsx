import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import styles from './AddViewModal.module.scss';
import { useGetAllViews, useStoredInputValue } from '../../inputUtils';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectFilterState } from '../../slices/filterSlice';
import { selectSort } from '../../slices/sortSlice';
import { selectLabels } from '../../slices/labelsSlice';
import { selectLayout } from '../../slices/layoutSlice';

interface AddViewModalProps {
  isOpen: boolean;
  handleViewToggle: () => void;
  setLocalViews: React.Dispatch<React.SetStateAction<IView[]>>;
}

const AddViewModal: React.FC<AddViewModalProps> = ({ isOpen, handleViewToggle, setLocalViews }) => {
  const [description, setDescription] = useState('');
  const { data: displayInfo } = useDisplayInfo();
  const filters = useSelector(selectFilterState);
  const sorts = useSelector(selectSort);
  const labels = useSelector(selectLabels);
  const layout = useSelector(selectLayout);

  const { setStoredValue } = useStoredInputValue('trelliscope_views', description);

  const views = useGetAllViews(displayInfo?.name as string);

  const { enqueueSnackbar } = useSnackbar();

  const newSort = sorts.map((sort) => ({ ...sort, type: 'sort' }));
  const newFilter = filters.map((filter) => ({ ...filter, type: 'filter' }));

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleSaveView = () => {
    const viewExists = views.some((view) => view.name === description);
    if (viewExists) {
      enqueueSnackbar('Custom view name already exists!', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
      });
      return;
    }
    setStoredValue(
      JSON.stringify({
        name: description,
        state: {
          layout: { viewtype: layout?.viewtype, page: layout?.page, ncol: layout?.ncol, type: layout?.type },
          labels: { varnames: labels, type: 'labels' },
          sort: [...newSort],
          filter: [...newFilter],
        },
      }),
    );
    const newViews = [...views, { name: description }];
    setLocalViews(newViews);
    handleViewToggle();
    enqueueSnackbar('View saved!', {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      autoHideDuration: 3000,
    });
  };

  return (
    <div className={styles.addViewModal}>
      <Dialog fullWidth open={isOpen} onClose={handleViewToggle}>
        <DialogTitle>Add a new view</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a description and save this view locally.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            onKeyDown={(e) => e.stopPropagation()}
            onChange={handleDescriptionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewToggle}>Cancel</Button>
          <Button onClick={handleSaveView}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddViewModal;