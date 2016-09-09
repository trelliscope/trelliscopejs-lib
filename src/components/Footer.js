import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { uiConstsSelector, windowWidthSelector } from '../selectors/ui';
import { filterCardinalitySelector } from '../selectors/cogData.js';
import { displayInfoSelector, filterSelector, sortSelector } from '../selectors';
import FooterChip from './FooterChip';

const Footer = ({ style, sort, filter, nFilt, nPanels }) => {
  let sortContent = '';
  let filterContent = '';
  let spacerContent = '';

  if (sort.length > 0) {
    sortContent = (
      <div style={style.sectionWrapper}>
        <div style={style.sectionText}>
          Sorting on:
        </div>
        <div style={style.chipWrapper}>
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
      <div style={style.sectionWrapper}>
        <div style={style.sectionText}>
          Filtering on:
        </div>
        <div style={style.chipWrapper}>
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
        <div style={style.filterText}>
          ({nFilt} of {nPanels} panels)
        </div>
      </div>
    );
  }

  if (filter.length > 0 && sort.length > 0) {
    spacerContent = <div style={style.spacer} />;
  }

  return (
    <div style={style.wrapper}>
      {sortContent}
      {spacerContent}
      {filterContent}
    </div>
  );
};

Footer.propTypes = {
  style: React.PropTypes.object,
  sort: React.PropTypes.array,
  filter: React.PropTypes.array,
  nFilt: React.PropTypes.number,
  nPanels: React.PropTypes.number
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

const styleSelector = createSelector(
  windowWidthSelector, uiConstsSelector, sortInfoSelector, filterInfoSelector,
  filterCardinalitySelector, displayInfoSelector,
  (ww, ui, sort, filter, nFilt, di) => ({
    style: {
      wrapper: {
        position: 'absolute',
        boxSizing: 'border-box',
        bottom: 0,
        left: 0,
        width: ww,
        height: ui.footer.height,
        paddingLeft: 10,
        margin: 0,
        lineHeight: `${ui.footer.height}px`,
        fontSize: ui.footer.height * 0.5,
        fontWeight: 300,
        background: ui.footer.background,
        color: ui.footer.color,
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
    },
    sort,
    filter,
    nFilt,
    nPanels: di.info.n
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Footer);
