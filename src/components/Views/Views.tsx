import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faChevronUp, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import isEqual from 'lodash.isequal';
import { setLabels, selectLabels } from '../../slices/labelsSlice';
import { setFiltersandFilterViews, selectFilterState } from '../../slices/filterSlice';
import { setLayout, LayoutAction, selectLayout } from '../../slices/layoutSlice';
import { setSort, selectSort } from '../../slices/sortSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import AddViewModal from '../AddViewModal/AddViewModal';
import { useGetAllLocalViews, getLocalStorageKey } from '../../inputUtils';
import styles from './Views.module.scss';

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

  const filters = useSelector(selectFilterState);
  const sorts = useSelector(selectSort);
  const labels = useSelector(selectLabels);
  const layout = useSelector(selectLayout);

  const trimmedLayout = {
    ncol: layout?.ncol,
    page: layout?.page,
    type: layout?.type,
    viewtype: layout?.viewtype,
  };

  const trimmedSort = sorts.map((sort) => {
    const { varname, dir, metatype } = sort;
    return { varname, dir, metatype };
  });

  const [activeViews, setActiveViews] = useState<string[]>([]);

  const checkIfActiveView = () => {
    const combinedUserandDefaultViews = views?.concat(allViews);
    setActiveViews([]);
    const activeCombinedItems = combinedUserandDefaultViews?.reduce((acc, view) => {
      const { filter: valueFilter, labels: valueLabels, layout: valueLayout, sort: valueSort } = view.state || {};
      const comparableLabels = valueLabels?.varnames;
      const comparableLayout = {
        ncol: valueLayout?.ncol,
        page: valueLayout?.page,
        type: valueLayout?.type,
        viewtype: valueLayout?.viewtype,
      };
      const comparableSort = valueSort?.map((sort) => {
        const { varname, dir, metatype } = sort;
        return { varname, dir, metatype };
      });

      // to ensure that isEqual functions correctly we need to sort the items. We need to spread the state items to make them mutable.
      valueFilter.sort((a, b) => a.varname.localeCompare(b.varname));
      const filtersMutable = [...filters];
      filtersMutable.sort((a, b) => a.varname.localeCompare(b.varname));
      comparableLabels.sort();
      const labelsMutable = [...labels];
      labelsMutable.sort();
      comparableSort.sort((a, b) => a.varname.localeCompare(b.varname));
      trimmedSort.sort((a, b) => a.varname.localeCompare(b.varname));

      if (
        isEqual(valueFilter, filtersMutable) &&
        isEqual(comparableLabels, labelsMutable) &&
        isEqual(comparableLayout, trimmedLayout) &&
        isEqual(comparableSort, trimmedSort)
      ) {
        acc.push(view.name);
      }
      return acc;
    }, [] as string[]);
    setActiveViews(activeCombinedItems);
  };
  useEffect(() => {
    checkIfActiveView();
  }, [views, localViews, filters, sorts, labels, layout]);

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
            <div key={value.name}>
              <Box sx={{ display: 'flex' }}>
                <MenuItem
                  selected={activeViews.includes(value.name)}
                  sx={{ width: '100%' }}
                  autoFocus
                  onClick={() => handleViewChange(value.state, value.name)}
                >
                  <Typography variant="inherit" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '400px' }}>
                    {value.name}
                  </Typography>
                </MenuItem>
                <Divider />
              </Box>
            </div>
          ))}
          {allViews?.map((value) => (
            <div key={value.name}>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <MenuItem
                  selected={activeViews.includes(value.name)}
                  sx={{ width: '100%' }}
                  onClick={() => handleViewChange(value.state, value.name)}
                >
                  <Typography variant="inherit" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '400px' }}>
                    {value.name}
                  </Typography>
                </MenuItem>
                <IconButton sx={{ mr: '5px' }} aria-label="close" size="small" onClick={() => handleDeleteView(value.name)}>
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </Box>
            </div>
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
