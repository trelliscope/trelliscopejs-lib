import React from 'react';
import { Button, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { createSelector } from 'reselect';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { layoutSelector } from '../../selectors';
import type { RootState } from '../../store';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import { setLayout } from '../../slices/layoutSlice';
import styles from './SidebarLayout.module.scss';

interface SidebarLayoutProps {
  layout: LayoutState;
  hasRelDisps: boolean;
  handleChange: (layout: LayoutState) => void;
  resetRelDisps: () => void;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ layout, hasRelDisps, handleChange, resetRelDisps }) => {
  const handleLayoutChange = (value: string, isRow: boolean) => {
    const num = parseInt(value || '1', 10);
    if (num > 15 || num < 0) return;
    handleChange({
      nrow: isRow ? num : layout.nrow,
      ncol: !isRow ? num : layout.ncol,
      arrange: layout.arrange,
      pageNum: layout.pageNum,
    });
  };

  return (
    <>
      {hasRelDisps ? (
        <div className={styles.relDisp}>
          <div className={styles.relDispText}>Grid layout cannot be changed when viewing related displays.</div>
          <div className={styles.relDispButton}>
            <Button variant="outlined" color="primary" onClick={resetRelDisps} size="small">
              Remove Related Displays
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.row}>
            <div className={styles.label}>Rows:</div>
            <div className={styles.nInput}>
              <input
                value={layout.nrow}
                min={1}
                max={15}
                type="number"
                onChange={(e) => handleLayoutChange(e.target.value, true)}
              />
            </div>
          </div>
          <Divider />
          <div className={styles.row}>
            <div className={styles.label}>Columns:</div>
            <div className={styles.nInput}>
              <input
                value={layout.ncol}
                min={1}
                max={15}
                type="number"
                onChange={(e) => handleLayoutChange(e.target.value, false)}
              />
            </div>
          </div>
          <Divider />
          <div className={styles.row}>Arrangement:</div>
          <div className={styles.row}>
            <RadioGroup
              name="arrangement"
              value={layout.arrange}
              onChange={(e, ar) =>
                handleChange({
                  nrow: layout.nrow,
                  ncol: layout.ncol,
                  arrange: ar as LayoutState['arrange'],
                  pageNum: layout.pageNum,
                })
              }
            >
              <FormControlLabel
                value="row"
                control={<Radio />}
                label={
                  <span className={styles.inputLabelSpan}>
                    By row
                    <i className={`icon-byrow ${styles.inputIcon}`} />
                  </span>
                }
                className={styles.inputRadio}
              />
              <FormControlLabel
                value="column"
                control={<Radio />}
                label={
                  <span className={styles.inputLabelSpan}>
                    By column
                    <i className={`icon-bycol ${styles.inputIcon}`} />
                  </span>
                }
                className={styles.inputRadio}
              />
            </RadioGroup>
          </div>
          <Divider />
        </>
      )}
    </>
  );
};

const selectedRelDispsSelector = (state: RootState) => state.selectedRelDisps;

const stateSelector = createSelector(layoutSelector, selectedRelDispsSelector, (layout, selectedRelDisps) => ({
  layout,
  hasRelDisps: selectedRelDisps.length > 0,
}));

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleChange: (layout: LayoutState) => dispatch(setLayout(layout)),
  resetRelDisps: () => {
    dispatch(setSelectedRelDisps([]));
    dispatch(setRelDispPositions([]));
  },
});

export default connect(stateSelector, mapDispatchToProps)(SidebarLayout);
