import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { windowWidthSelector, contentHeightSelector } from '../../selectors/ui';
import { filterCardinalitySelector } from '../../selectors/cogData';
import { filterSelector, singlePageAppSelector } from '../../selectors';
import FooterChip from '../FooterChip';
import ExportInputDialog from '../ExportInputDialog';
import getCustomProperties from '../../getCustomProperties';
import { selectSort, setSort } from '../../slices/sortSlice';
import { setLayout } from '../../slices/layoutSlice';
import { setFilter, setFilterView } from '../../slices/filterSlice';
import styles from './Footer.module.scss';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const { data: displayInfo } = useDisplayInfo();
  const [dialogOpen, setDialogOpen] = useState(false);
  const sort = useSelector(selectSort);
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
  const cdi = {
    info: {
      cogInfo: {
        jeff: 'jeff',
      },
    },
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
        const mutableValue = [...value];
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
          const tot = cdi.info.cogInfo[curState.name].levels.length;
          text = `${mutableValue.length} of ${tot}`;
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
      dispatch(setLayout({ page: 1 }));
    } else if (x.type === 'filter') {
      dispatch(setFilterView({ name: x.label, which: 'remove' }));
      dispatch(setFilter(x.label));
      dispatch(setLayout({ page: 1 }));
    }
  };

  return (
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
