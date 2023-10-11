import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import styles from './AddViewModal.module.scss';
import { useGetAllLocalViews, useStoredInputValue } from '../../inputUtils';
import { selectFilterState } from '../../slices/filterSlice';
import { selectSort } from '../../slices/sortSlice';
import { selectLabels } from '../../slices/labelsSlice';
import { selectLayout } from '../../slices/layoutSlice';
import { filterViewSelector } from '../../selectors';

interface AddViewModalProps {
  isOpen: boolean;
  handleViewToggle: () => void;
  setLocalViews: React.Dispatch<React.SetStateAction<IView[]>>;
}

const AddViewModal: React.FC<AddViewModalProps> = ({ isOpen, handleViewToggle, setLocalViews }) => {
  const [viewForm, setViewForm] = useState({
    name: '',
    description: '',
    sort: true,
    filter: true,
    labels: true,
    columns: true,
    viewtype: true,
    sidebarActive: true,
    panel: true,
    showLabels: true,
  });
  const filters = useSelector(selectFilterState);
  const filterViews = useSelector(filterViewSelector);
  const sorts = useSelector(selectSort);
  const labels = useSelector(selectLabels);
  const layout = useSelector(selectLayout);

  const { setStoredValue } = useStoredInputValue('trelliscope_views', viewForm?.name);

  const views = useGetAllLocalViews();

  const { enqueueSnackbar } = useSnackbar();

  const newSort = sorts.map((sort) => ({ ...sort, type: 'sort' }));
  const newFilter = filters.map((filter) => ({ ...filter, type: 'filter' }));

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewForm({ ...viewForm, [e.target.id || e.target.name]: e.target.value });
  };

  const handleFormSwitchChange = (id: string, value: boolean) => {
    setViewForm({ ...viewForm, [id]: value });
  };

  const handleSaveView = () => {
    const viewExists = views.some((view) => view.name === viewForm?.name);
    if (viewExists) {
      enqueueSnackbar(`Custom view name '${viewForm?.name}' already exists!`, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3000,
      });
      return;
    }
    setStoredValue(
      JSON.stringify({
        name: viewForm?.name,
        description: viewForm?.description,
        state: {
          layout: {
            viewtype: viewForm.viewtype ? layout?.viewtype : undefined,
            page: viewForm.columns ? layout?.page : undefined,
            ncol: viewForm.columns ? layout?.ncol : undefined,
            type: viewForm.viewtype ? layout?.type : undefined,
            panel: layout?.panel && viewForm.panel ? layout?.panel : undefined,
            sidebarActive: viewForm.sidebarActive ? layout?.sidebarActive : undefined,
            showLabels: viewForm.showLabels ? layout?.showLabels : undefined,
          },
          labels: viewForm.labels ? { varnames: labels, type: 'labels' } : undefined,
          sort: viewForm.sort ? newSort : undefined,
          filter: viewForm.filter ? newFilter : undefined,
          filterView: viewForm.filter ? filterViews?.active : undefined,
        },
      }),
    );
    const newViews = [...views, { name: viewForm?.name }];
    setLocalViews(newViews);
    handleViewToggle();
    enqueueSnackbar(`View ${viewForm?.name} saved!`, {
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
            id="name"
            autoFocus
            margin="dense"
            label="View Name"
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation();
              }
            }}
            fullWidth
            onChange={handleFormChange}
          />
          <TextField
            id="description"
            autoFocus
            margin="dense"
            label="View Description"
            fullWidth
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation();
              }
            }}
            onChange={handleFormChange}
          />
          <Typography sx={{ mt: 3 }} variant="h6">
            Include in view
          </Typography>
          <FormGroup sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('sort', value)} />}
              label="Sort"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('filter', value)} />}
              label="Filter"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('labels', value)} />}
              label="Labels"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('showLabels', value)} />}
              label="Labels Visible"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('columns', value)} />}
              label="Panel Columns"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('viewtype', value)} />}
              label="Grid / Table Layout"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('sidebarActive', value)} />}
              label="Sidebar Open / Closed"
            />
            <FormControlLabel
              control={<Switch defaultChecked onChange={(e, value) => handleFormSwitchChange('panel', value)} />}
              label="Selected Panel (if multiple)"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewToggle}>Cancel</Button>
          <Button
            disabled={
              !viewForm.sort &&
              !viewForm.filter &&
              !viewForm.labels &&
              !viewForm.showLabels &&
              !viewForm.columns &&
              !viewForm.sidebarActive &&
              !viewForm.panel
            }
            onClick={handleSaveView}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddViewModal;
