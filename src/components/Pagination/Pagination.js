import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { setLayout } from '../../actions';
import { nPerPageSelector, pageNumSelector, dialogOpenSelector, fullscreenSelector, cogDataSelector } from '../../selectors';
import { filterCardinalitySelector } from '../../selectors/cogData';
import styles from './Pagination.module.scss';

const Pagination = ({ n, npp, totPages, totPanels, dialogOpen, fullscreen, handleChange, cogData }) => {
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

  useEffect(() => {
    if (fullscreen) {
      Mousetrap.bind('right', () => {
        if (!dialogOpen) {
          pageRight();
        }
      });
      Mousetrap.bind('left', () => {
        if (!dialogOpen) {
          pageLeft();
        }
      });
    }
  }, []);

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

Pagination.propTypes = {
  n: PropTypes.number.isRequired,
  npp: PropTypes.number.isRequired,
  totPages: PropTypes.number.isRequired,
  totPanels: PropTypes.number.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  cogData: PropTypes.object.isRequired,
};

// ------ redux container ------

const stateSelector = createSelector(
  pageNumSelector,
  filterCardinalitySelector,
  nPerPageSelector,
  dialogOpenSelector,
  fullscreenSelector,
  cogDataSelector,
  (n, card, npp, dialogOpen, fullscreen, cogData) => ({
    n,
    totPanels: card,
    totPages: Math.ceil(card / npp),
    npp,
    dialogOpen,
    fullscreen,
    cogData,
  }),
);

const mapStateToProps = (state) => stateSelector(state);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (n) => {
    dispatch(setLayout({ pageNum: n }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
