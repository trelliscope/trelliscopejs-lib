import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { windowWidthSelector, contentHeightSelector } from '../../selectors/ui';
import { filterSelector, singlePageAppSelector } from '../../selectors';
import FooterChip from '../FooterChip';
import ExportInputDialog from '../ExportInputDialog';
import getCustomProperties from '../../getCustomProperties';
import { selectSort, setSort } from '../../slices/sortSlice';
import { setLayout } from '../../slices/layoutSlice';
import { removeFilter, setFilterView } from '../../slices/filterSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { DataContext } from '../DataProvider';
import { format } from '../FormattedNumber/FormattedNumber';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: displayInfo } = useDisplayInfo();
  const { allData, filteredData } = useContext(DataContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const sort = useSelector(selectSort);
  const filter = useSelector(filterSelector);
  const windowWidth = useSelector(windowWidthSelector);
  const contentHeight = useSelector(contentHeightSelector);
  const singlePage = useSelector(singlePageAppSelector);
  const [headerHeight, footerHeight] = getCustomProperties(['--header-height', '--footer-height']) as number[];
  const [hasInputs, setHasInputs] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const { length: allDataLength } = allData;
  const { length: filteredDataLength } = filteredData;

  useEffect(() => {
    if (displayInfo && displayInfo.inputs) {
      setHasInputs(true);
    }
    if (displayInfo?.inputs?.storageInterface?.type === 'localStorage') {
      setHasLocalStorage(true);
    }
  }, [displayInfo]);

  const style = {
    width: windowWidth - (singlePage ? 0 : footerHeight),
    top: contentHeight + headerHeight,
  };

  const sortRes = [];
  for (let i = 0; i < sort.length; i += 1) {
    const { varname } = sort[i];
    const { type } = displayInfo?.metas.find((m) => m.varname === varname) || {};
    let icon = 'icon-sort-amount';
    if (type === 'factor') {
      icon = 'icon-sort-alpha';
    } else if (type === 'number') {
      icon = 'icon-sort-numeric';
    }
    icon = `${icon}-${sort[i].dir}`;
    sortRes.push({ varname, icon });
  }

  const filterRes = [];
  for (let i = 0; i < filter.state.length; i += 1) {
    const curState = filter.state[i];
    const { varname } = curState;
    let text = '';
    if (curState.filtertype === 'numberrange') {
      const { min, max } = curState as INumberRangeFilterState;
      if (!min && max) text = `< ${format(max, 2)}`;
      if (min && !max) text = `> ${format(min, 2)}`;
      if (min && max) text = `${format(min, 2)} -- ${format(max, 2)}`;
    } else if (curState.filtertype === 'category') {
      const charLimit = 15;
      const { values } = curState as ICategoryFilterState;
      if (values !== undefined) {
        const mutableValue = [...values];
        const n = mutableValue.length;
        let textLength = 0;
        let idx = 0;
        while (idx < n && textLength <= charLimit) {
          textLength = textLength + mutableValue[idx].length + 2;
          idx += 1;
        }
        if (idx === n) {
          // build a string of selected values
          text = mutableValue.sort().join(', ');
        } else {
          // just show "k of n"
          text = `${format(mutableValue.length, 0)} of ${format(allDataLength, 0)}`;
        }
      }
    }
    filterRes.push({ name: varname, text });
  }

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleStateClose = (x: { type: string; index: number; label: string }) => {
    if (x.type === 'sort') {
      dispatch(setSort(x.index));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
    } else if (x.type === 'filter') {
      dispatch(setFilterView({ name: x.label, which: 'remove' }));
      dispatch(removeFilter(x.label));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
    }
  };

  return (
    <>
      <div className={styles.footerWrapper} style={style}>
        <div className={styles.footerInner}>
          {sortRes.length > 0 && (
            <div className={styles.footerSectionWrapper}>
              <div className={styles.footerSectionText}>Sorting on:</div>
              <div className={styles.footerChipWrapper}>
                {sortRes.map((el: { varname: string; icon: string }, i: number) => (
                  <FooterChip
                    key={`${el.varname}_sortchip`}
                    label={el.varname}
                    icon={el.icon}
                    text=""
                    index={i}
                    type="sort"
                    handleClose={handleStateClose}
                  />
                ))}
              </div>
            </div>
          )}
          {filterRes.length > 0 && sortRes.length > 0 && <div className={styles.footerSpacer} />}
          {filterRes.length > 0 && (
            <div className={styles.footerSectionWrapper}>
              <div className={styles.footerSectionText}>Filtering on:</div>
              <div className={styles.footerChipWrapper}>
                {filterRes.map((el: { name: string; text: string }, i: number) => (
                  <FooterChip
                    key={`${el.name}_filterchip`}
                    label={el.name}
                    icon=""
                    text={el.text}
                    index={i}
                    type="filter"
                    handleClose={handleStateClose}
                  />
                ))}
              </div>
              <div className={styles.footerFilterText}>{`(${format(filteredDataLength, 0)} of ${format(
                allDataLength,
                0,
              )} panels)`}</div>
            </div>
          )}
        </div>
      </div>
      {hasInputs && hasLocalStorage && (
        <div className={styles.footerButtonDiv}>
          <Button size="small" variant="contained" color="primary" onClick={handleClickOpen}>
            Export Inputs
          </Button>
        </div>
      )}
      <ExportInputDialog
        open={dialogOpen}
        handleClose={handleClose}
        displayInfo={displayInfo as IDisplay}
        hasInputs={hasInputs}
        hasLocalStorage={hasLocalStorage}
      />
    </>
  );
};

export default Footer;
