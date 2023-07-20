import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { faChevronUp, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import styles from './Views.module.scss';
import { setLabels } from '../../slices/labelsSlice';
import { setFiltersandFilterViews } from '../../slices/filterSlice';
import { setLayout, LayoutAction } from '../../slices/layoutSlice';
import { setSort } from '../../slices/sortSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import AddViewModal from '../AddViewModal/AddViewModal';
import { useGetAllLocalViews, getLocalStorageKey } from '../../inputUtils';

const Views: React.FC = () => {
  const dispatch = useDispatch();
  const { data: displayInfo } = useDisplayInfo();
  const views = displayInfo?.views as IView[];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openView, setOpenView] = useState(false);
  const allViews = useGetAllLocalViews() as IView[];
  const [localViews, setLocalViews] = useState(allViews);
  const { enqueueSnackbar } = useSnackbar();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (value: IDisplayState, name: string) => {
    const {
      filter: valueFilter,
      labels: valueLabels,
      layout: valueLayout,
      sort: valueSort,
    } = value ||
    JSON.parse(
      localStorage.getItem(
        getLocalStorageKey(displayInfo?.tags || [], displayInfo?.name || '', 'trelliscope_views', name),
      ) as string,
    ).state ||
    {};

    if (valueLayout) dispatch(setLayout(valueLayout as LayoutAction));

    if (valueLabels) dispatch(setLabels(valueLabels.varnames));

    if (valueSort) dispatch(setSort(valueSort));

    if (valueFilter) {
      dispatch(setFiltersandFilterViews(valueFilter));
    }
    setAnchorEl(null);
  };

  const handleDeleteView = (name: string) => {
    const lsKey = getLocalStorageKey(displayInfo?.tags || [], displayInfo?.name || '', 'trelliscope_views', name);
    localStorage.removeItem(lsKey);
    const newLocalViews = localViews.filter((view) => view.name !== name);
    setLocalViews(newLocalViews);
    enqueueSnackbar(`View ${name} deleted`, {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      autoHideDuration: 3000,
    });
  };

  const handleViewToggle = () => {
    setOpenView(!openView);
  };

  return (
    <div className={styles.views}>
      <div>
        <Button
          sx={{ textTransform: 'capitalize', color: '#000' }}
          id="views-button"
          aria-controls={open ? 'views-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />}
        >
          Views
        </Button>
        <Menu id="views-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{}}>
          {views?.map((value) => (
            <Box key={value.name} sx={{ display: 'flex' }}>
              <MenuItem onClick={() => handleViewChange(value.state, value.name)}>
                <Typography variant="inherit" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '400px' }}>
                  {value.name}
                </Typography>
              </MenuItem>
            </Box>
          ))}
          {localViews?.map((value) => (
            <Box key={value.name} sx={{ display: 'flex' }}>
              <MenuItem onClick={() => handleViewChange(value.state, value.name)}>
                <Typography variant="inherit" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '400px' }}>
                  {value.name}
                </Typography>
              </MenuItem>
              <IconButton sx={{ mr: '5px' }} aria-label="close" size="small" onClick={() => handleDeleteView(value.name)}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', m: '10px' }}>
            <Button variant="contained" color="primary" onClick={handleViewToggle}>
              Create view based on current state
            </Button>
          </Box>
          <AddViewModal isOpen={openView} handleViewToggle={handleViewToggle} setLocalViews={setLocalViews} />
        </Menu>
      </div>
    </div>
  );
};

export default Views;
