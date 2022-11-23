import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { setLayout } from '../../slices/layoutSlice';
import { nPerPageSelector, pageNumSelector, dialogOpenSelector, fullscreenSelector, cogDataSelector } from '../../selectors';
import { filterCardinalitySelector } from '../../selectors/cogData';
import styles from './Pagination.module.scss';

const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const n = useSelector(pageNumSelector);
  const totPanels = useSelector(filterCardinalitySelector);
  const npp = useSelector(nPerPageSelector);
  const dialogOpen = useSelector(dialogOpenSelector);
  const fullscreen = useSelector(fullscreenSelector);
  const cogData = useSelector(cogDataSelector);
  const totPages = Math.ceil(totPanels / npp);

  const handleChange = (pageNum: number) => {
    dispatch(setLayout({ pageNum }));
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

  useHotkeys('right', pageRight, { enabled: fullscreen && !dialogOpen }, [n, totPanels, npp]);
  useHotkeys('left', pageLeft, { enabled: fullscreen && !dialogOpen }, [n, totPanels, npp]);

  if (cogData.isFetching || (cogData.isLoaded && cogData.crossfilter === undefined)) {
    return <div className={styles.paginationProgress}>loading panels...</div>;
  }
  if (totPanels === 0) {
    return <div />;
  }

  const pFrom = npp * (n - 1) + 1;
  const pTo = Math.min(npp * n, totPanels);
  let pRange = <span>{pFrom}</span>;
  if (pFrom !== pTo) {
    pRange = (
      <span>
        {pFrom}
        &nbsp;
        <span className={styles.paginationPageDash}>-</span>
        &nbsp;
        {pTo}
      </span>
    );
  }
  const txt = (
    <span>
      {pRange}
      <span>{` of ${totPanels}`}</span>
    </span>
  );
  return (
    <div className={styles.paginationOuter}>
      <div className={styles.paginationLabel}>{txt}</div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n <= 1} className={styles.paginationButton} onClick={() => pageFirst()}>
            <FirstPageIcon />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>First</div>
      </div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n <= 1} className={styles.paginationButton} onClick={() => pageLeft()}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>Prev</div>
      </div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n >= totPages} className={styles.paginationButton} onClick={() => pageRight()}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>Next</div>
      </div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n >= totPages} className={styles.paginationButton} onClick={() => pageLast()}>
            <LastPageIcon />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>Last</div>
      </div>
    </div>
  );
};

export default Pagination;
