import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { sidebarActiveSelector } from '../../selectors/ui';
import { setSidebarActive } from '../../slices/uiSlice';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { selectNumPerPage, selectPage, setLayout } from '../../slices/layoutSlice';
import Pagination from '../Pagination';
import { DataContext } from '../DataProvider';
import styles from './ContentHeader.module.scss';
import { cogDataSelector, fullscreenSelector } from '../../selectors';
import { selectDialogOpen } from '../../selectors/app';

const ContentHeader: React.FC = () => {
  const selectedDisplay = useSelectedDisplay();
  const { allData, filteredData } = useContext(DataContext);
  const dispatch = useDispatch();
  const displayLoaded = selectedDisplay?.name !== '';
  const n = useSelector(selectPage);
  const totPanels = filteredData.length;
  const npp = useSelector(selectNumPerPage);
  const fullscreen = useSelector(fullscreenSelector);
  const cogData = useSelector(cogDataSelector);
  const totPages = Math.ceil(totPanels / npp);
  const dialogOpen = useSelector(selectDialogOpen);
  const sidebarOpen = useSelector(sidebarActiveSelector);

  const handleChange = (page: number) => {
    dispatch(
      setLayout({
        page,
        type: 'layout',
      }),
    );
  };

  const pageLeft = () => {
    let nn = n - 1;
    if (nn < 1) {
      nn += 1;
    }
    return handleChange(nn);
  };

  const pageRight = () => {
    let nn = n + 1;
    if (nn > totPages) {
      nn -= 1;
    }
    return handleChange(nn);
  };

  const pageFirst = () => {
    handleChange(1);
  };

  const pageLast = () => {
    handleChange(totPages);
  };

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
      <div className={styles.contentHeaderPagination}>
        {displayLoaded && (
          <Pagination
            n={n}
            totPanels={totPanels}
            npp={npp}
            dialogOpen={dialogOpen}
            fullscreen={fullscreen}
            cogData={cogData}
            totPages={totPages}
            pageLeft={pageLeft}
            pageRight={pageRight}
            pageFirst={pageFirst}
            pageLast={pageLast}
          />
        )}
      </div>
    </div>
  );
};

export default ContentHeader;
