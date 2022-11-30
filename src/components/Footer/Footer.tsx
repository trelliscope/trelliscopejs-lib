import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { windowWidthSelector, contentHeightSelector } from '../../selectors/ui';
import { filterCardinalitySelector } from '../../selectors/cogData';
import { curDisplayInfoSelector, filterSelector, sortSelector, singlePageAppSelector } from '../../selectors';
import FooterChip from '../FooterChip';
import ExportInputDialog from '../ExportInputDialog';
import getCustomProperties from '../../getCustomProperties';
import { setSort } from '../../slices/sortSlice';
import { setLayout } from '../../slices/layoutSlice';
import { setFilter, setFilterView } from '../../slices/filterSlice';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const sort = useSelector(sortSelector);
  const cdi = useSelector(curDisplayInfoSelector);
  const filter = useSelector(filterSelector);
  const windowWidth = useSelector(windowWidthSelector);
  const contentHeight = useSelector(contentHeightSelector);
  const singlePage = useSelector(singlePageAppSelector);
  const nFilt = useSelector(filterCardinalitySelector);
  const keys = Object.keys(filter.state);
  const [headerHeight, footerHeight] = getCustomProperties(['--header-height', '--footer-height']) as number[];

  const style = {
    width: windowWidth - (singlePage ? 0 : footerHeight),
    top: contentHeight + headerHeight,
  };

  const sortRes = [];
  for (let i = 0; i < sort.length; i += 1) {
    const { name } = sort[i];
    const { type } = cdi.info.cogInfo[name];
    let icon = 'icon-sort-amount';
    if (type === 'factor') {
      icon = 'icon-sort-alpha';
    } else if (type === 'numeric') {
      icon = 'icon-sort-numeric';
    }
    icon = `${icon}-${sort[i].dir}`;
    sortRes.push({ name, icon });
  }

  const filterRes = [];
  for (let i = 0; i < keys.length; i += 1) {
    const curState = filter.state[keys[i]];
    if (curState.value !== undefined) {
      let text = '';
      if (curState.varType === 'numeric') {
        const { from, to } = curState.value as FilterRange;
        if (from === undefined && to !== undefined) {
          text = `< ${to}`;
        } else if (from !== undefined && to === undefined) {
          text = `> ${from}`;
        } else if (from !== undefined && to !== undefined) {
          text = `${from} -- ${to}`;
        }
      } else if (curState.varType === 'factor') {
        const charLimit = 15;
        const value = curState.value as FilterCat;
        const n = value.length;
        let textLength = 0;
        let idx = 0;
        while (idx < n && textLength <= charLimit) {
          textLength = textLength + value[idx].length + 2;
          idx += 1;
        }
        if (idx === n) {
          // build a string of selected values
          text = value.sort().join(', ');
        } else {
          // just show "k of n"
          const tot = cdi.info.cogInfo[curState.name].levels.length;
          text = `${value.length} of ${tot}`;
        }
      }
      filterRes.push({ name: keys[i], text });
    }
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
      dispatch(setLayout({ pageNum: 1 }));
    } else if (x.type === 'filter') {
      dispatch(setFilterView({ name: x.label, which: 'remove' }));
      dispatch(setFilter(x.label));
      dispatch(setLayout({ pageNum: 1 }));
    }
  };

  console.log(sortRes);

  return (
    <div className={styles.footerWrapper} style={style}>
      <div className={styles.footerInner}>
        {sortRes.length > 0 && (
          <div className={styles.footerSectionWrapper}>
            <div className={styles.footerSectionText}>Sorting on:</div>
            <div className={styles.footerChipWrapper}>
              {sortRes.map((el: { name: string; icon: string }, i: number) => (
                <FooterChip
                  key={`${el.name}_sortchip`}
                  label={el.name}
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
            <div className={styles.footerFilterText}>{`(${nFilt} of ${cdi.info.n} panels)`}</div>
          </div>
        )}
      </div>
      {cdi.info.has_inputs && cdi.info.input_type === 'localStorage' && (
        <div className={styles.footerButtonDiv}>
          <Button size="small" variant="contained" color="primary" onClick={handleClickOpen}>
            Export Inputs
          </Button>
        </div>
      )}
      <ExportInputDialog open={dialogOpen} handleClose={handleClose} displayInfo={cdi.info} />
    </div>
  );
};

export default Footer;
