import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { windowWidthSelector } from '../selectors/ui';
import { filterCardinalitySelector } from '../selectors/cogData';
import { displayInfoSelector, filterSelector, sortSelector } from '../selectors';
import FooterChip from './FooterChip';
import uiConsts from '../styles/uiConsts';

const Footer = ({ sheet: { classes }, width, sort, filter, nFilt, nPanels }) => {
  let sortContent = '';
  let filterContent = '';
  let spacerContent = '';

  if (sort.length > 0) {
    sortContent = (
      <div className={classes.sectionWrapper}>
        <div className={classes.sectionText}>
          Sorting on:
        </div>
        <div className={classes.chipWrapper}>
          {sort.map((el, i) => (
            <FooterChip
              key={`${el.name}_sortchip`}
              label={el.name}
              icon={el.icon}
              text={''}
              index={i}
              type="sort"
            />
          ))}
        </div>
      </div>
    );
  }

  if (filter.length > 0) {
    filterContent = (
      <div className={classes.sectionWrapper}>
        <div className={classes.sectionText}>
          Filtering on:
        </div>
        <div className={classes.chipWrapper}>
          {filter.map((el, i) => (
            <FooterChip
              key={`${el.name}_filterchip`}
              label={el.name}
              icon={''}
              text={el.text}
              index={i}
              type="filter"
            />
          ))}
        </div>
        <div className={classes.filterText}>
          ({nFilt} of {nPanels} panels)
        </div>
      </div>
    );
  }

  if (filter.length > 0 && sort.length > 0) {
    spacerContent = <div className={classes.spacer} />;
  }

  return (
    <div className={classes.wrapper} style={{ width }}>
      {sortContent}
      {spacerContent}
      {filterContent}
    </div>
  );
};

Footer.propTypes = {
  sheet: React.PropTypes.object,
  width: React.PropTypes.number,
  sort: React.PropTypes.array,
  filter: React.PropTypes.array,
  nFilt: React.PropTypes.number,
  nPanels: React.PropTypes.number
};

// ------ static styles ------

const staticStyles = {
  wrapper: {
    position: 'fixed',
    boxSizing: 'border-box',
    bottom: 0,
    left: 0,
    height: uiConsts.footer.height,
    paddingLeft: 10,
    margin: 0,
    lineHeight: `${uiConsts.footer.height}px`,
    fontSize: uiConsts.footer.height * 0.5,
    fontWeight: 300,
    background: uiConsts.footer.background,
    color: uiConsts.footer.color,
    display: 'flex',
    flexDirection: 'row'
  },
  sectionWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  chipWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  sectionText: {
    marginRight: 3
  },
  spacer: {
    width: 12
  },
  filterText: {
    marginLeft: 5
  }
};

// ------ redux container ------

const sortInfoSelector = createSelector(
  sortSelector, displayInfoSelector,
  (sort, di) => {
    const res = [];
    for (let i = 0; i < sort.length; i += 1) {
      const name = sort[i].name;
      const type = di.info.cogInfo[name].type;
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
  }
);

const filterInfoSelector = createSelector(
  filterSelector, displayInfoSelector,
  (filter, di) => {
    const keys = Object.keys(filter.state);
    const res = [];
    for (let i = 0; i < keys.length; i += 1) {
      const curState = filter.state[keys[i]];
      if (curState.value !== undefined) {
        let text = '';
        if (curState.varType === 'numeric') {
          if (curState.value.from === undefined && curState.value.to !== undefined) {
            text = `< ${curState.value.to}`;
          } else if (curState.value.from !== undefined && curState.value.to === undefined) {
            text = `> ${curState.value.from}`;
          } else if (curState.value.from !== undefined && curState.value.to !== undefined) {
            text = `${curState.value.from} \u2013 ${curState.value.to}`;
          }
        } else if (curState.varType === 'factor') {
          const charLimit = 15;
          const n = curState.value.length;
          let textLength = 0;
          let idx = 0;
          while (idx < n && textLength <= charLimit) {
            textLength = textLength + curState.value[idx].length + 2;
            idx += 1;
          }
          if (idx === n) {
            // build a string of selected values
            text = curState.value.sort().join(', ');
          } else {
            // just show "k of n"
            const tot = di.info.cogInfo[curState.name].levels.length;
            text = `${curState.value.length} of ${tot}`;
          }
        }
        res.push({ name: keys[i], text });
      }
    }
    return res;
  }
);

const stateSelector = createSelector(
  windowWidthSelector, sortInfoSelector, filterInfoSelector,
  filterCardinalitySelector, displayInfoSelector,
  (ww, sort, filter, nFilt, di) => ({
    width: ww,
    sort,
    filter,
    nFilt,
    nPanels: di.info.n
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(Footer));
