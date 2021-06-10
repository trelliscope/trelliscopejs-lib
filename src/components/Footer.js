import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { createSelector } from 'reselect';
import { windowWidthSelector, contentHeightSelector } from '../selectors/ui';
import { filterCardinalitySelector } from '../selectors/cogData';
import {
  curDisplayInfoSelector, filterSelector, sortSelector, singlePageAppSelector
} from '../selectors';
import FooterChip from './FooterChip';
import ExportInputDialog from './ExportInputDialog';
import uiConsts from '../assets/styles/uiConsts';

const Footer = ({
  classes, style, sort, filter, nFilt, nPanels, displayInfo
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

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
              text=""
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
              icon=""
              text={el.text}
              index={i}
              type="filter"
            />
          ))}
        </div>
        <div className={classes.filterText}>
          {`(${nFilt} of ${nPanels} panels)`}
        </div>
      </div>
    );
  }

  if (filter.length > 0 && sort.length > 0) {
    spacerContent = <div className={classes.spacer} />;
  }

  return (
    <div className={classes.wrapper} style={style}>
      <div className={classes.inner}>
        {sortContent}
        {spacerContent}
        {filterContent}
      </div>
      {displayInfo.has_inputs && displayInfo.input_type === 'localStorage' && (
        <div className={classes.buttonDiv}>
          <Button size="small" variant="contained" color="primary" onClick={handleClickOpen}>
            Export Inputs
          </Button>
        </div>
      )}
      <ExportInputDialog open={dialogOpen} handleClose={handleClose} displayInfo={displayInfo} />
    </div>
  );
};

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  sort: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  nFilt: PropTypes.number.isRequired,
  displayInfo: PropTypes.object.isRequired,
  nPanels: PropTypes.number
};

Footer.defaultProps = () => ({
  nPanels: 0
});

// ------ static styles ------

const staticStyles = {
  wrapper: {
    position: 'absolute',
    boxSizing: 'border-box',
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
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    zIndex: 1001
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    paddingRight: 10
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
  },
  buttonDiv: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
};

// ------ redux container ------

const sortInfoSelector = createSelector(
  sortSelector, curDisplayInfoSelector,
  (sort, cdi) => {
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
  }
);

const filterInfoSelector = createSelector(
  filterSelector, curDisplayInfoSelector,
  (filter, cdi) => {
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
            text = `${curState.value.from} -- ${curState.value.to}`;
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
            const tot = cdi.info.cogInfo[curState.name].levels.length;
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
  filterCardinalitySelector, curDisplayInfoSelector, singlePageAppSelector,
  contentHeightSelector,
  (ww, sort, filter, nFilt, cdi, singlePage, ch) => ({
    style: {
      width: ww - (singlePage ? 0 : uiConsts.footer.height),
      top: ch + uiConsts.header.height
    },
    sort,
    filter,
    nFilt,
    displayInfo: cdi.info,
    nPanels: cdi.info.n
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(Footer));
