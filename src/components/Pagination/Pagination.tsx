import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import { cogDataSelector, singlePageAppSelector } from '../../selectors';
import { selectDialogOpen, panelDialogIsOpenSelector } from '../../selectors/app';
import { DataContext } from '../DataProvider';
import { selectNumPerPage, selectPage, setLayout } from '../../slices/layoutSlice';
import styles from './Pagination.module.scss';
import FormattedNumber from '../FormattedNumber';

const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const { filteredData } = useContext(DataContext);
  const dialogOpen = useSelector(selectDialogOpen);
  const panelDialogOpen = useSelector(panelDialogIsOpenSelector);
  const n = useSelector(selectPage);
  const totPanels = filteredData.length;
  const npp = useSelector(selectNumPerPage);
  const singlePageApp = useSelector(singlePageAppSelector);
  const cogData = useSelector(cogDataSelector);
  const totPages = Math.ceil(totPanels / npp);

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

  useHotkeys('right', pageRight, { enabled: singlePageApp && !dialogOpen && !panelDialogOpen }, [n, totPanels, npp]);
  useHotkeys('left', pageLeft, { enabled: singlePageApp && !dialogOpen && !panelDialogOpen }, [n, totPanels, npp]);

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
        <FormattedNumber value={pFrom} maximumFractionDigits={0} />
        &nbsp;
        <span className={styles.paginationPageDash}>-</span>
        &nbsp;
        <FormattedNumber value={pTo} maximumFractionDigits={0} />
      </span>
    );
  }

  return (
    <div className={styles.paginationOuter}>
      <div className={styles.paginationLabel}>
        <span>
          {pRange}
          <span>
            {` of `} <FormattedNumber value={totPanels} maximumFractionDigits={0} />
          </span>
        </span>
      </div>
      <div className={styles.paginationButtonContainer}>
        <div className={styles.paginationButtonWrap}>
          <div className={styles.paginationButtonDiv}>
            <IconButton size="small" disabled={n <= 1} className={styles.paginationButton} onClick={() => pageFirst()}>
              <FontAwesomeIcon icon={faBackwardStep} size="sm" />
            </IconButton>
          </div>
          <div className={styles.paginationButtonText}>First</div>
        </div>
        <div className={styles.paginationButtonWrap}>
          <div className={styles.paginationButtonDiv}>
            <IconButton size="small" disabled={n <= 1} className={styles.paginationButton} onClick={() => pageLeft()}>
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </IconButton>
          </div>
          <div className={styles.paginationButtonText}>Prev</div>
        </div>
        <div className={styles.paginationButtonWrap}>
          <div className={styles.paginationButtonDiv}>
            <IconButton
              size="small"
              disabled={n >= totPages}
              className={styles.paginationButton}
              onClick={() => pageRight()}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </IconButton>
          </div>
          <div className={styles.paginationButtonText}>Next</div>
        </div>
        <div className={styles.paginationButtonWrap}>
          <div className={styles.paginationButtonDiv}>
            <IconButton size="small" disabled={n >= totPages} className={styles.paginationButton} onClick={() => pageLast()}>
              <FontAwesomeIcon icon={faForwardStep} size="sm" />
            </IconButton>
          </div>
          <div className={styles.paginationButtonText}>Last</div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
