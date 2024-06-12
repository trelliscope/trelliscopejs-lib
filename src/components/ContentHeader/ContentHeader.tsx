import React from 'react';
import classNames from 'classnames';
import { Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { MRT_ShowHideColumnsButton } from 'material-react-table';
import { useTheme } from '@mui/material/styles';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import Pagination from '../Pagination';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import Sort from '../Sort';
import Labels from '../Labels';
import { selectFilterState } from '../../slices/filterSlice';
import Views from '../Views/Views';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import styles from './ContentHeader.module.scss';
import ErrorWrapper from '../ErrorWrapper';

interface ContentHeaderProps {
  table: any;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ table }) => {
  const selectedDisplay = useSelectedDisplay();
  const dispatch = useDispatch();
  const { data } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const displayLoaded = selectedDisplay?.name !== '';
  const activeFilters = useSelector(selectFilterState);
  const theme = useTheme();

  const leftPosition = layout?.sidebarActive ? '386px' : '-30px';

  return (
    <ErrorWrapper>
      <FontAwesomeIcon
        style={{
          left: leftPosition,
          color: theme.palette.text.primary,
          borderColor: theme.palette.secondary.dark,
          background: theme.palette.secondary.light,
        }}
        onClick={() => dispatch(setLayout({ sidebarActive: !layout.sidebarActive }))}
        size="sm"
        className={styles.contentHeaderControlsItemToggleIcon}
        icon={faChevronLeft}
      />
      <div style={{ backgroundColor: theme.palette.secondary.dark }} className={styles.contentHeader}>
        <div className={styles.contentHeaderControls}>
          <div className={styles.contentHeaderControlsLeft}>
            <Box
              sx={{ backgroundColor: theme.palette.secondary.light }}
              className={classNames(styles.contentHeaderControlsItem, styles.contentHeaderControlsItemToggle)}
            >
              <Button
                id="filter-drawer-button"
                data-testid="filter-drawer-button"
                onClick={() => dispatch(setLayout({ sidebarActive: !layout.sidebarActive }))}
                variant="text"
                sx={{
                  color: theme.palette.text.primary,
                  textTransform: 'unset',
                  fontSize: '15px',
                  borderRadius: 0,
                  minWidth: '90px',
                }}
                startIcon={
                  !layout.sidebarActive && <FontAwesomeIcon data-testid="filter-drawer-button-icon" icon={faChevronRight} />
                }
              >
                Filters
                {activeFilters.length > 0 && (
                  <span className={styles.contentHeaderControlsItemToggleBadge}>
                    <FontAwesomeIcon color={theme.palette.primary.main} icon={faCircle} />
                    <span
                      className={styles.contentHeaderControlsItemToggleBadgeNum}
                      style={{ right: activeFilters.length > 9 ? '-5px' : '-1px', color: theme.palette.text.secondary }}
                    >
                      {activeFilters.length}
                    </span>
                  </span>
                )}
              </Button>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.secondary.light }} className={styles.contentHeaderControlsItem}>
              <Sort />
            </Box>
            {layout?.viewtype === 'table' && (
              <Box
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  '.MuiList-root': { backgroundColor: theme.palette.primary.main },
                  svg: { color: theme.palette.primary.contrastText },
                }}
                data-testid="columns-table"
                id="column-control"
                className={styles.contentHeaderControlsItem}
              >
                <span style={{ color: theme.palette.text.primary }}>Columns</span>
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <MRT_ShowHideColumnsButton table={table} />
              </Box>
            )}
            {layout?.viewtype !== 'table' && (
              <>
                <Box
                  sx={{ backgroundColor: theme.palette.secondary.light }}
                  id="column-control"
                  className={styles.contentHeaderControlsItem}
                >
                  <ColumnSelector />
                </Box>
                <Box
                  sx={{ backgroundColor: theme.palette.secondary.light }}
                  id="label-control"
                  className={styles.contentHeaderControlsItem}
                >
                  <Labels />
                </Box>
              </>
            )}
            {data && (
              <Box
                sx={{ backgroundColor: theme.palette.secondary.light }}
                id="view-control"
                className={styles.contentHeaderControlsItem}
              >
                <Views />
              </Box>
            )}
            <Box
              sx={{ backgroundColor: theme.palette.secondary.light }}
              id="layout-control"
              className={styles.contentHeaderControlsItem}
            >
              <LayoutSelector />
            </Box>
          </div>
          <div className={styles.contentHeaderControlsPagination}>{displayLoaded && <Pagination />}</div>
        </div>
      </div>
    </ErrorWrapper>
  );
};

export default ContentHeader;
