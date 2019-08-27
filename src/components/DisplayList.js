import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import injectSheet from 'react-jss';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import red from '@material-ui/core/colors/red';
import { selectedRelDispsSelector } from '../selectors/display';
import { configSelector } from '../selectors';
import { addRelDisp, removeRelDisp } from '../actions';

const redA200 = red.A200;

const DisplayList = ({
  classes, selectable, di, displayGroups, handleClick,
  cfg, selectedRelDisps, handleCheckbox
}) => {
  const groupKeys = Object.keys(displayGroups);

  const makeSubheader = (groupName, n) => {
    if (n > 1) {
      return (
        <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
          <ListSubheader style={{ fontSize: 20, color: 'black' }} component="div">
            {groupName}
          </ListSubheader>
        </GridListTile>
      );
    }
    return null;
  };

  const displayList = groupKeys.map((k) => (
    <div className={classes.groupContainer} key={k}>
      <GridList
        cellHeight={200}
        cols={3}
        className={classes.gridList}
      >
        {makeSubheader(k, groupKeys.length)}
        {displayGroups[k].map((i) => (
          <GridListTile
            key={i}
            className={classes.gridTile}
            onClick={() => {
              if (selectable) {
                handleCheckbox(i, selectedRelDisps.indexOf(i) > -1);
              } else {
                handleClick(di[i].name, di[i].group, di[i].desc);
              }
            }}
          >
            <img
              src={`${cfg.cog_server.info.base}/${di[i].group}/${di[i].name}/thumb.png`}
              alt={di[i].name}
              className={classes.img}
              key={`img${i}`}
            />
            { selectable && (
              <Checkbox
                classes={{ root: classes.checkbox }}
                checked={selectedRelDisps.indexOf(i) > -1}
                onChange={() => { handleCheckbox(i, selectedRelDisps.indexOf(i) > -1); }}
                value={`checked${i}`}
                inputProps={{
                  // 'aria-label': 'primary checkbox'
                }}
              />
            )}
            <GridListTileBar
              // titlePosition="top"
              classes={{
                root: classes.titleBar
              }}
              title={(
                <div className={classes.gridTitle}>
                  {di[i].name}
                </div>
              )}
              subtitle={(
                <span style={{ fontSize: 13 }}>
                  {di[i].desc}
                  <br />
                  <span className={classes.gridSubtitle}>
                    {di[i].n}
                    &nbsp;panels,
                    {di[i].updated.substring(0, di[i].updated.length - 3)}
                  </span>
                </span>
              )}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  ));

  return (
    <div className={classes.container}>
      {displayList}
    </div>
  );
};

// ------ static styles ------

const staticStyles = {
  container: {
    height: 400,
    overflowY: 'auto'
  },
  groupContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    width: 700,
    marginBottom: 24
  },
  gridTile: {
    cursor: 'pointer'
  },
  gridTitle: {
    fontWeight: 400,
    color: redA200,
    fontSize: 15
  },
  gridSubtitle: {
    fontStyle: 'italic',
    fontSize: 11
  },
  img: {
    opacity: 1,
    '&:hover': {
      opacity: 0.7
    }
  },
  titleBar: {
    background: 'rgba(0, 0, 0, 0.8) !important'
  },
  checkbox: {
    position: 'absolute !important',
    left: 0,
    top: 0,
    background: 'rgba(69, 138, 249, 0.9) !important',
    color: 'white !important',
    '&checked': {
      color: 'white !important'
    }
  }
};

DisplayList.propTypes = {
  selectable: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  di: PropTypes.array.isRequired,
  displayGroups: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  cfg: PropTypes.object.isRequired,
  selectedRelDisps: PropTypes.array.isRequired,
  handleCheckbox: PropTypes.func.isRequired
};

const styleSelector = createSelector(
  selectedRelDispsSelector, configSelector,
  (selectedRelDisps, cfg) => ({
    selectedRelDisps,
    cfg
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleCheckbox: (i, checked) => {
    if (checked) {
      dispatch(removeRelDisp(i));
    } else {
      dispatch(addRelDisp(i));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(DisplayList));
