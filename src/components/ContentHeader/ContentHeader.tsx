import React from 'react';
import classNames from 'classnames';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronLeft, faCircle } from '@fortawesome/free-solid-svg-icons';
import { MRT_ShowHideColumnsButton } from 'material-react-table';
import { sidebarActiveSelector } from '../../selectors/ui';
import { setSidebarActive } from '../../slices/uiSlice';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import Pagination from '../Pagination';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { selectLayout } from '../../slices/layoutSlice';
import Sort from '../Sort';
import Labels from '../Labels';
import { selectFilterState } from '../../slices/filterSlice';
import Views from '../Views/Views';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import styles from './ContentHeader.module.scss';

interface ContentHeaderProps {
  tableRef: React.RefObject<null>;
  rerender: never;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ tableRef, rerender }) => {
  const selectedDisplay = useSelectedDisplay();
  const dispatch = useDispatch();
  const { data } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const displayLoaded = selectedDisplay?.name !== '';
  const sidebarOpen = useSelector(sidebarActiveSelector);
  const activeFilters = useSelector(selectFilterState);

  return (
    <div className={styles.contentHeader}>
      <div className={styles.contentHeaderControls}>
        <div className={styles.contentHeaderControlsLeft}>
          <div className={classNames(styles.contentHeaderControlsItem, styles.contentHeaderControlsItemToggle)}>
            <Button
              id="filter-drawer-button"
              onClick={() => dispatch(setSidebarActive(!sidebarOpen))}
              variant={sidebarOpen ? 'contained' : 'text'}
              sx={{
                color: sidebarOpen ? '#fff' : '#000',
                textTransform: 'unset',
                fontSize: '15px',
                borderRadius: 0,
                minWidth: '115px',
              }}
              startIcon={sidebarOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faChevronLeft} />}
            >
              Filters
              {activeFilters.length > 0 && (
                <span className={styles.contentHeaderControlsItemToggleBadge}>
                  <FontAwesomeIcon icon={faCircle} />
                  <span
                    className={styles.contentHeaderControlsItemToggleBadgeNum}
                    style={activeFilters.length > 9 ? { right: '-5px' } : { right: '-1px' }}
                  >
                    {activeFilters.length}
                  </span>
                </span>
              )}
            </Button>
          </div>
          <div className={styles.contentHeaderControlsItem}>
            <Sort />
          </div>
          {tableRef?.current && rerender && layout?.viewtype === 'table' && (
            <div id="column-control" className={styles.contentHeaderControlsItem}>
              <span>Columns</span>
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <MRT_ShowHideColumnsButton table={tableRef?.current} />
            </div>
          )}
          {layout?.viewtype !== 'table' && (
            <>
              <div id="column-control" className={styles.contentHeaderControlsItem}>
                <ColumnSelector />
              </div>
              <div id="label-control" className={styles.contentHeaderControlsItem}>
                <Labels />
              </div>
            </>
          )}
          {data && (
            <div id="view-control" className={styles.contentHeaderControlsItem}>
              <Views />
            </div>
          )}
          <div id="layout-control" className={styles.contentHeaderControlsItem}>
            <LayoutSelector />
          </div>
        </div>
        <div className={styles.contentHeaderControlsPagination}>{displayLoaded && <Pagination />}</div>
      </div>
    </div>
  );
};

export default ContentHeader;
