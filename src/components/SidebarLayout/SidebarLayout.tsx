import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faGripHorizontal } from '@fortawesome/free-solid-svg-icons';
import { Button, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { selectSelectedRelDisps, setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import { LayoutAction, setLayout, selectLayout } from '../../slices/layoutSlice';
import styles from './SidebarLayout.module.scss';

const SidebarLayout: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(selectLayout);
  const selectedRelDisps = useSelector(selectSelectedRelDisps);
  const hasRelDisps = selectedRelDisps.length > 0;

  const handleChange = (sidebarLayout: LayoutAction) => dispatch(setLayout(sidebarLayout));

  const resetRelDisps = () => {
    dispatch(setSelectedRelDisps([]));
    dispatch(setRelDispPositions([]));
  };

  const handleLayoutChange = (value: string, isRow: boolean) => {
    let nonZeroValue = value;
    if (value.charAt(0) === '0') {
      nonZeroValue = value.slice(1);
    }
    const num = parseInt(nonZeroValue || '1', 10);
    if (num > 15 || num < 0) return;
    handleChange({
      nrow: isRow ? num : layout.nrow,
      ncol: !isRow ? num : layout.ncol,
      arrange: layout.arrange,
      page: layout.page,
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
                  arrange: ar as ILayoutState['arrange'],
                  page: layout.page,
                })
              }
            >
              <FormControlLabel
                value="rows"
                control={<Radio />}
                label={
                  <div className={styles.inputLabelSpan}>
                    By Row
                    <FontAwesomeIcon icon={faGripHorizontal} />
                  </div>
                }
                className={styles.inputRadio}
              />
              <FormControlLabel
                value="cols"
                control={<Radio />}
                label={
                  <span className={styles.inputLabelSpan}>
                    By column
                    <FontAwesomeIcon icon={faGripVertical} />
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

export default SidebarLayout;
