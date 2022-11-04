import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import { createSelector } from 'reselect';
import { windowWidthSelector, contentHeightSelector } from '../../selectors/ui';
import { filterCardinalitySelector } from '../../selectors/cogData';
import { curDisplayInfoSelector, filterSelector, sortSelector, singlePageAppSelector } from '../../selectors';
import FooterChip from '../FooterChip';
import ExportInputDialog from '../ExportInputDialog';
import uiConsts from '../../assets/styles/uiConsts';
import type { RootState } from '../../store';
import styles from './Footer.module.scss';
import { FilterState } from '../../slices/filterSlice';

interface FooterProps {
  style: {
    width: number;
    top: number;
  };
  sort: { name: string; icon: string }[];
  filter: { name: string; text: string }[];
  nFilt: number;
  nPanels?: number;
  displayInfo: DisplayObject;
}

const Footer: React.FC<FooterProps> = ({ style, sort, filter, nFilt, nPanels, displayInfo }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className={styles.footerWrapper} style={style}>
      <div className={styles.footerInner}>
        {sort.length > 0 && (
          <div className={styles.footerSectionWrapper}>
            <div className={styles.footerSectionText}>Sorting on:</div>
            <div className={styles.footerChipWrapper}>
              {sort.map((el: { name: string; icon: string }, i: number) => (
                <FooterChip key={`${el.name}_sortchip`} label={el.name} icon={el.icon} text="" index={i} type="sort" />
              ))}
            </div>
          </div>
        )}
        {filter.length > 0 && sort.length > 0 && <div className={styles.footerSpacer} />}
        {filter.length > 0 && (
          <div className={styles.footerSectionWrapper}>
            <div className={styles.footerSectionText}>Filtering on:</div>
            <div className={styles.footerChipWrapper}>
              {filter.map((el: { name: string; text: string }, i: number) => (
                <FooterChip key={`${el.name}_filterchip`} label={el.name} icon="" text={el.text} index={i} type="filter" />
              ))}
            </div>
            <div className={styles.footerFilterText}>{`(${nFilt} of ${nPanels} panels)`}</div>
          </div>
        )}
      </div>
      {displayInfo.has_inputs && displayInfo.input_type === 'localStorage' && (
        <div className={styles.footerButtonDiv}>
          <Button size="small" variant="contained" color="primary" onClick={handleClickOpen}>
            Export Inputs
          </Button>
        </div>
      )}
      <ExportInputDialog open={dialogOpen} handleClose={handleClose} displayInfo={displayInfo} />
    </div>
  );
};

Footer.defaultProps = {
  nPanels: 0,
};

// ------ redux container ------

const sortInfoSelector = createSelector(sortSelector, curDisplayInfoSelector, (sort, cdi) => {
  const res = [];
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
    res.push({ name, icon });
  }
  return res;
});

const filterInfoSelector = createSelector(filterSelector, curDisplayInfoSelector, (filter: FilterState, cdi) => {
  const keys = Object.keys(filter.state);
  const res = [];
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
      res.push({ name: keys[i], text });
    }
  }
  return res;
});

const stateSelector = createSelector(
  windowWidthSelector,
  sortInfoSelector,
  filterInfoSelector,
  filterCardinalitySelector,
  curDisplayInfoSelector,
  singlePageAppSelector,
  contentHeightSelector,
  (ww, sort, filter, nFilt, cdi, singlePage, ch) => ({
    style: {
      width: ww - (singlePage ? 0 : uiConsts.footer.height),
      top: ch + uiConsts.header.height,
    },
    sort,
    filter,
    nFilt,
    displayInfo: cdi.info,
    nPanels: cdi.info.n,
  }),
);

const mapStateToProps = (state: RootState) => stateSelector(state);

export default connect(mapStateToProps)(Footer);
