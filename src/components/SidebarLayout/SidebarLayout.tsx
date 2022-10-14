import React from 'react';
import { Button, Divider, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { createSelector } from 'reselect';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import NumericInput from '../NumericInput';
import { layoutSelector } from '../../selectors';
import type { RootState } from '../../store';
import { setLayout, setRelDispPositions, setSelectedRelDisps } from '../../actions';
import styles from './SidebarLayout.module.scss';

interface SidebarLayoutProps {
  layout: LayoutState;
  hasRelDisps: boolean;
  handleChange: (layout: LayoutState) => void;
  resetRelDisps: () => void;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ layout, hasRelDisps, handleChange, resetRelDisps }) => (
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
            <NumericInput
              arrows
              value={layout.nrow}
              size={3}
              min={1}
              max={15}
              step={1}
              onChange={(nr) =>
                handleChange({ nrow: nr, ncol: layout.ncol, arrange: layout.arrange, pageNum: layout.pageNum })
              }
            />
          </div>
        </div>
        <Divider />
        <div className={styles.row}>
          <div className={styles.label}>Columns:</div>
          <div className={styles.nInput}>
            <NumericInput
              arrows
              value={layout.ncol}
              size={3}
              min={1}
              max={15}
              step={1}
              onChange={(nc) =>
                handleChange({ nrow: layout.nrow, ncol: nc, arrange: layout.arrange, pageNum: layout.pageNum })
              }
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
