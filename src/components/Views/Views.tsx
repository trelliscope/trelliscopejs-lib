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
  faPlus,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, ButtonGroup, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import isEqual from 'lodash.isequal';
import { setLabels, selectLabels } from '../../slices/labelsSlice';
import { selectFilterState, setFilterView, setFiltersandFilterViews } from '../../slices/filterSlice';
import { setLayout, LayoutAction, selectLayout } from '../../slices/layoutSlice';
import { setSort, selectSort } from '../../slices/sortSlice';
import { useDisplayInfo, useDisplayMetasWithInputs } from '../../slices/displayInfoAPI';
import AddViewModal from '../AddViewModal/AddViewModal';
import { useGetAllLocalViews, getLocalStorageKey } from '../../inputUtils';
import styles from './Views.module.scss';
import { filterViewSelector } from '../../selectors';
import ExportViewsModal from '../ExportViewsModal';
import ImportViewsModal from '../ImportViewsModal';
import { useConfig } from '../../slices/configAPI';
import {
  FILTER_TYPE_CATEGORY,
  FILTER_TYPE_DATERANGE,
  FILTER_TYPE_DATETIMERANGE,
  FILTER_TYPE_NUMBERRANGE,
  META_TYPE_FACTOR,
} from '../../constants';
import { getLabelFromFactor } from '../../utils';
import ErrorWrapper from '../ErrorWrapper';

const Views: React.FC = () => {
  const dispatch = useDispatch();
  const { data: displayInfo } = useDisplayInfo();
  const viewsDisplay = displayInfo?.views as IView[];
  const views = [...viewsDisplay];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openView, setOpenView] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const allLocalViews = useGetAllLocalViews() as IView[];
  const [localViews, setLocalViews] = useState(allLocalViews);
  const { data: configObj } = useConfig();

  const displayMetas = useDisplayMetasWithInputs();

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
  }, [viewsDisplay, localViews, filters, sorts, labels, layout, allLocalViews?.length]);

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

  const handleExportToggle = () => {
    setOpenExport(!openExport);
  };

  const handleImportToggle = () => {
    setOpenImport(!openImport);
  };

  const getMetaLevels = (varname: string) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === varname);
    return foundMeta?.levels;
  };

  const generateDescriptionItalics = (view: IView) => {
    const { state } = view;

    const { filter: localFilter, sort: localSort, layout: localLayout, labels: localLabels } = state || {};
    if (!localFilter && !localSort && !localLayout && !localLabels) return '';
    const text = ['Contains '];

    if (localFilter && localFilter?.length !== 0) {
      localFilter.forEach((filter) => {
        text.push('Filters for ');
        if (filter.filtertype === FILTER_TYPE_CATEGORY) {
          const { varname, values, metatype } = filter as ICategoryFilterState;
          if (metatype === META_TYPE_FACTOR) {
            text.push(`category ${varname} with values: `);
            values.forEach((value) => {
              const label = getLabelFromFactor(value as unknown as number, getMetaLevels(varname) as string[]);
              text.push(`${label}, `);
            });
          } else {
            text.push(`category ${varname} with values: ${values}`);
          }
        }
        if (
          filter.filtertype === FILTER_TYPE_NUMBERRANGE ||
          filter.filtertype === FILTER_TYPE_DATERANGE ||
          filter.filtertype === FILTER_TYPE_DATETIMERANGE
        ) {
          const { varname, min, max } = filter as INumberRangeFilterState;
          text.push(`${varname} Range with min: ${min} and max: ${max}`);
        }
      });
    }

    if (localSort && localSort?.length !== 0) {
      localSort.forEach((sort) => {
        const { varname, dir } = sort;
        text.push(` Sorts for ${varname} in ${dir} order`);
      });
    }

    if (localLayout && Object.keys(localLayout).length > 0) {
      text.push(' layout');
      const { ncol, page, panel, showLabels, sidebarActive, viewtype } = localLayout;
      if (ncol) text.push(` ${ncol} columns`);
      if (page) text.push(` on page ${page}`);
      if (panel) text.push(` ${panel} as selected panel`);
      if (showLabels) text.push(` with labels visible`);
      if (sidebarActive) text.push(` with sidebar open`);
      if (!sidebarActive) text.push(` with sidebar closed`);
      if (viewtype) text.push(` with viewtype ${viewtype}`);
    }

    if (localLabels && localLabels?.varnames?.length !== 0) {
      text.push(` with the following labels ${localLabels?.varnames}`);
    }

    return text;
  };

  return (
    <ErrorWrapper>
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
          <Menu
            id="views-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ sx: { pt: 0, pb: 0 } }}
          >
            {combinedViews?.map((value) => {
              const italics = generateDescriptionItalics(value);
              return (
                <div key={value.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <MenuItem
                      selected={activeViews.includes(value.name)}
                      sx={{ width: '100%', justifyContent: 'space-between' }}
                      onClick={() => handleViewChange(value.state, value.name)}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" noWrap sx={{ maxWidth: '400px' }}>
                          {value.name}
                        </Typography>
                        <Tooltip arrow placement="left" title={value.description}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              maxWidth: '400px',
                              // this is a hack to remove the default safari tooltip
                              '&::after': {
                                content: '""',
                                display: 'block',
                              },
                            }}
                          >
                            {value.description}
                          </Typography>
                        </Tooltip>
                        <Tooltip arrow placement="left" title={italics}>
                          <Typography
                            noWrap
                            sx={{
                              maxWidth: '400px',
                              fontStyle: 'italic',
                              fontSize: '12px',
                              // this is a hack to remove the default safari tooltip
                              '&::after': {
                                content: '""',
                                display: 'block',
                              },
                            }}
                          >
                            {italics}
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
              );
            })}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ButtonGroup sx={{ width: '100%', '& .MuiButtonGroup-grouped': { width: '200px' } }} variant="outlined">
                <Button
                  sx={{
                    borderRadius: 0,
                    color: configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText,
                  }}
                  variant="contained"
                  onClick={handleViewToggle}
                  startIcon={
                    <FontAwesomeIcon
                      color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
                      icon={faPlus}
                    />
                  }
                >
                  Create view based on current state
                </Button>
                <Button
                  sx={{
                    borderRadius: 0,
                    color: configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText,
                  }}
                  variant="contained"
                  onClick={handleExportToggle}
                  startIcon={
                    <FontAwesomeIcon
                      color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
                      icon={faDownload}
                    />
                  }
                >
                  Export Views
                </Button>
                <Button
                  sx={{
                    borderRadius: 0,
                    color: configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText,
                  }}
                  variant="contained"
                  onClick={handleImportToggle}
                  startIcon={
                    <FontAwesomeIcon
                      color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
                      icon={faUpload}
                    />
                  }
                >
                  Import Views
                </Button>
              </ButtonGroup>
            </Box>
            <AddViewModal isOpen={openView} handleViewToggle={handleViewToggle} setLocalViews={setLocalViews} />
            <ExportViewsModal isOpen={openExport} handleExportToggle={handleExportToggle} />
            <ImportViewsModal isOpen={openImport} handleImportToggle={handleImportToggle} />
          </Menu>
        </div>
      </div>
    </ErrorWrapper>
  );
};

export default Views;
