import React from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { sidebarActiveSelector } from '../../selectors/ui';
import { setSidebarActive } from '../../slices/uiSlice';
import styles from './ContentHeader.module.scss';

const ContentHeader: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(sidebarActiveSelector);

  return (
    <div className={styles.contentHeader}>
      <div className={styles.contentHeaderControls}>
        <div className={styles.contentHeaderControlsItem}>
          <Button
            onClick={() => dispatch(setSidebarActive(!sidebarOpen))}
            variant={sidebarOpen ? 'contained' : 'text'}
            sx={{
              color: sidebarOpen ? '#fff' : '#000',
              fontWeight: 600,
              textTransform: 'unset',
              fontSize: '15px',
              borderRadius: 0,
            }}
            startIcon={sidebarOpen ? <CloseIcon /> : <KeyboardArrowLeftIcon />}
          >
            Explore
          </Button>
        </div>
      </div>
      <div className={styles.contentHeaderPagination} />
    </div>
  );
};

export default ContentHeader;
