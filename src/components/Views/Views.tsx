import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  faChevronUp,
  faChevronDown,
  faTrash,
  faFilter,
  faSort,
  faTableColumns,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import isEqual from 'lodash.isequal';
import { setLabels, selectLabels } from '../../slices/labelsSlice';
import { selectFilterState, setFilterView, setFiltersandFilterViews } from '../../slices/filterSlice';
import { setLayout, LayoutAction, selectLayout } from '../../slices/layoutSlice';
import { setSort, selectSort } from '../../slices/sortSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import AddViewModal from '../AddViewModal/AddViewModal';
import { useGetAllLocalViews, getLocalStorageKey } from '../../inputUtils';
import styles from './Views.module.scss';
import { filterViewSelector } from '../../selectors';

const Views: React.FC = () => {
  const dispatch = useDispatch();
  const { data: displayInfo } = useDisplayInfo();
  const viewsDisplay = displayInfo?.views as IView[];
  const views = [...viewsDisplay];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openView, setOpenView] = useState(false);
  const allLocalViews = useGetAllLocalViews() as IView[];
  const [localViews, setLocalViews] = useState(allLocalViews);

  const stateLayout = displayInfo?.state?.layout as ILayoutState;
  const stateLabels = displayInfo?.state?.labels?.varnames;
  const stateSort = displayInfo?.state?.sort as ISortState[];
  const stateFilters = displayInfo?.state?.filter as IFilterState[];
  const stateFilterViews = displayInfo?.state?.filterView as string[];

  const defaultView = {
    name: 'Default View',
    description: 'Default view for this display.',
    state: {
      layout: stateLayout,
      labels: { varnames: stateLabels } as ILabelState,
      sort: stateSort,
      filter: stateFilters,
      filterView: stateFilterViews,
    },
    isLocal: false,
  };

  const viewsWithLocalFlag = views.map((view) => ({ ...view, isLocal: false }));
  const localViewsWithLocalFlag = allLocalViews.map((localView) => ({ ...localView, isLocal: true }));
  const combinedViews = [defaultView, ...viewsWithLocalFlag, ...localViewsWithLocalFlag];

  const { enqueueSnackbar } = useSnackbar();
  const open = Boolean(anchorEl);

  const filterViews = useSelector(filterViewSelector);
  const filters = useSelector(selectFilterState);
  const sorts = useSelector(selectSort);
  const labels = useSelector(selectLabels);
  const layout = useSelector(selectLayout);

  const trimmedSort = sorts.map((sort) => {
    const { varname, dir, metatype } = sort;
    return { varname, dir, metatype };
  });

  const [activeViews, setActiveViews] = useState<string[]>([]);
  const checkIfActiveView = () => {
    setActiveViews([]);
    const activeCombinedItems = combinedViews?.reduce((acc, view) => {
      const { filter: valueFilterUnmutable, sort: valueSort } = view.state || {};
      const valueFilter = valueFilterUnmutable ? [...valueFilterUnmutable] : undefined;
      const comparableSort = valueSort?.map((sort) => {
        const { varname, dir, metatype } = sort;
        return { varname, dir, metatype };
      });

      // to ensure that isEqual functions correctly we need to sort the items. We need to spread the state items to make them mutable.
      if (valueFilter) {
        valueFilter.sort((a, b) => a.varname.localeCompare(b.varname));
      }
      const filtersMutable = [...filters];
      filtersMutable.sort((a, b) => a.varname.localeCompare(b.varname));
      if (comparableSort) {
        comparableSort.sort((a, b) => a.varname.localeCompare(b.varname));
      }
      trimmedSort.sort((a, b) => a.varname.localeCompare(b.varname));
      if (
        (isEqual(valueFilter, filtersMutable) && isEqual(comparableSort, trimmedSort)) ||
        (isEqual(comparableSort, trimmedSort) && !valueFilter) ||
        (isEqual(valueFilter, filtersMutable) && !comparableSort) ||
        (!valueFilter && !comparableSort)
      ) {
        acc.push(view.name);
      }
      return acc;
    }, [] as string[]);
    setActiveViews(activeCombinedItems);
  };
  useEffect(() => {
    checkIfActiveView();
  }, [viewsDisplay, localViews, filters, sorts, labels, layout]);

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
      filterView: valueFilterView,
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

    if (valueFilter) dispatch(setFiltersandFilterViews(valueFilter));

    if (valueFilterView) {
      const inactiveFilters = filterViews.inactive.filter((filter) => !valueFilterView.includes(filter));
      dispatch(setFilterView({ name: { active: valueFilterView, inactive: inactiveFilters }, which: 'set' }));
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
        <Menu id="views-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ sx: { pt: 0 } }}>
          {combinedViews?.map((value) => (
            <div key={value.name}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <MenuItem
                  selected={activeViews.includes(value.name)}
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                  onClick={() => handleViewChange(value.state, value.name)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Tooltip arrow title={value.name}>
                      <Typography variant="subtitle1" noWrap sx={{ maxWidth: '400px' }}>
                        {value.name}
                      </Typography>
                    </Tooltip>
                    <Tooltip arrow title={value.description}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: '400px' }}>
                        {value.description}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box sx={{ '& > *': { p: 1 }, display: 'flex', alignItems: 'center' }}>
                    {value?.state?.filter && (
                      <Tooltip arrow title="View has filters">
                        <FontAwesomeIcon color="gray" icon={faFilter} />
                      </Tooltip>
                    )}
                    {value?.state?.sort && (
                      <Tooltip arrow title="View has sorts">
                        <FontAwesomeIcon color="gray" icon={faSort} />
                      </Tooltip>
                    )}
                    {value?.state?.layout && (
                      <Tooltip arrow title="View has layout">
                        <FontAwesomeIcon color="gray" icon={faTableColumns} />
                      </Tooltip>
                    )}
                    {value?.state?.labels && (
                      <Tooltip arrow title="View has labels">
                        <FontAwesomeIcon color="gray" icon={faTag} />
                      </Tooltip>
                    )}
                  </Box>
                </MenuItem>
                {value.isLocal && (
                  <Box sx={{ borderLeft: '1px solid #E0E0E0', display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      sx={{ mr: '5px' }}
                      aria-label="close"
                      size="small"
                      onClick={() => handleDeleteView(value.name)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Divider />
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
