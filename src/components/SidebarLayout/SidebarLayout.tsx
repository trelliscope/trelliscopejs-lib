import React from 'react';
import { Button } from '@mui/material';
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
        </>
      )}
    </>
  );
};

export default SidebarLayout;
