import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faForwardStep, faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import styles from './Pagination.module.scss';
import FormattedNumber from '../FormattedNumber';

interface PaginationProps {
  n: number;
  totPanels: number;
  npp: number;
  dialogOpen: boolean;
  fullscreen: boolean;
  cogData: CogDataMutable;
  totPages: number;
  pageLeft: () => void;
  pageRight: () => void;
  pageFirst: () => void;
  pageLast: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  n,
  totPanels,
  npp,
  dialogOpen,
  fullscreen,
  cogData,
  totPages,
  pageLeft,
  pageRight,
  pageFirst,
  pageLast,
}) => {
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
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n <= 1} className={styles.paginationButton} onClick={() => pageFirst()}>
            <FontAwesomeIcon icon={faBackwardStep} size="sm" />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>First</div>
      </div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n <= 1} className={styles.paginationButton} onClick={() => pageLeft()}>
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>Prev</div>
      </div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n >= totPages} className={styles.paginationButton} onClick={() => pageRight()}>
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>Next</div>
      </div>
      <div className={styles.paginationButtonWrap}>
        <div className={styles.paginationButtonDiv}>
          <IconButton disabled={n >= totPages} className={styles.paginationButton} onClick={() => pageLast()}>
            <FontAwesomeIcon icon={faForwardStep} size="sm" />
          </IconButton>
        </div>
        <div className={styles.paginationButtonText}>Last</div>
      </div>
    </div>
  );
};

export default Pagination;
