import React from 'react';
import classNames from 'classnames';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { sidebarActiveSelector } from '../../selectors/ui';
import { setSidebarActive } from '../../slices/uiSlice';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import Pagination from '../Pagination';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import { selectLayout } from '../../slices/layoutSlice';
import Sort from '../Sort';
import Labels from '../Labels';
import styles from './ContentHeader.module.scss';

const ContentHeader: React.FC = () => {
  const selectedDisplay = useSelectedDisplay();
  const dispatch = useDispatch();
  const layout = useSelector(selectLayout);
  const displayLoaded = selectedDisplay?.name !== '';
  const sidebarOpen = useSelector(sidebarActiveSelector);

  return (
    <div className={styles.contentHeader}>
      <div className={styles.contentHeaderControls}>
        <div className={styles.contentHeaderControlsLeft}>
          <div className={classNames(styles.contentHeaderControlsItem, styles.contentHeaderControlsItemToggle)}>
            <Button
              onClick={() => dispatch(setSidebarActive(!sidebarOpen))}
              variant={sidebarOpen ? 'contained' : 'text'}
              sx={{
                color: sidebarOpen ? '#fff' : '#000',
                textTransform: 'unset',
                fontSize: '15px',
                borderRadius: 0,
              }}
              startIcon={sidebarOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faChevronLeft} />}
            >
              Explore
            </Button>
          </div>
          <div className={styles.contentHeaderControlsItem}>
            <Sort />
          </div>
          {layout?.viewtype !== 'table' && (
            <>
              <div className={styles.contentHeaderControlsItem}>
                <ColumnSelector />
              </div>
              <div className={styles.contentHeaderControlsItem}>
                <Labels />
              </div>
            </>
          )}
        </div>
        <div className={styles.contentHeaderControlsPagination}>{displayLoaded && <Pagination />}</div>
      </div>
    </div>
  );
};

export default ContentHeader;
