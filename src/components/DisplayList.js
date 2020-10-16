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
import { appIdSelector, configSelector, selectedDisplaySelector } from '../selectors';
import { contentHeightSelector, contentWidthSelector } from '../selectors/ui';
import {
  setSelectedRelDisps, setRelDispPositions, setLayout, fetchDisplay
} from '../actions';

const redA200 = red.A200;

const DisplayList = ({
  classes, selectable, di, displayGroups, handleClick,
  cfg, appId, selectedDisplay, selectedRelDisps, handleCheckbox,
  contentHeight, contentWidth
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
        cellHeight={180}
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
                handleCheckbox(i, selectedRelDisps, selectedDisplay,
                  di, contentHeight, contentWidth, cfg, appId);
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
                onChange={() => {
                  handleCheckbox(i, selectedRelDisps, selectedDisplay,
                    di, contentHeight, contentWidth, cfg, appId);
                }}
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
                  {di[i].name.replace(/_/g, ' ')}
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
        {cfg.disclaimer ? (
          <GridListTile cols={cfg.disclaimer.cols}>
            <div
              className={classes.disclaimer}
              dangerouslySetInnerHTML={{__html: cfg.disclaimer.text}}
            />
          </GridListTile>
        ) : ''}
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
  },
  disclaimer: {
    paddingLeft: 10,
    fontSize: 13,
    marginTop: -3
  }
};

DisplayList.propTypes = {
  selectable: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  di: PropTypes.array.isRequired,
  displayGroups: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  cfg: PropTypes.object.isRequired,
  appId: PropTypes.string.isRequired,
  selectedRelDisps: PropTypes.array.isRequired,
  selectedDisplay: PropTypes.object.isRequired,
  contentHeight: PropTypes.number.isRequired,
  contentWidth: PropTypes.number.isRequired,
  handleCheckbox: PropTypes.func.isRequired
};

const styleSelector = createSelector(
  selectedDisplaySelector, selectedRelDispsSelector, configSelector, appIdSelector,
  contentHeightSelector, contentWidthSelector,
  (selectedDisplay, selectedRelDisps, cfg, appId, contentHeight, contentWidth) => ({
    selectedDisplay,
    selectedRelDisps,
    appId,
    cfg,
    contentHeight,
    contentWidth
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const getRelDispPositions = (
  selectedDisplay, relDisps, displayInfo, contentHeight, contentWidth
) => {
  const dnames = displayInfo.map((d) => d.name);
  const idx = dnames.indexOf(selectedDisplay.name);
  const disps = [idx, ...relDisps];

  const n = disps.length;
  const contentAspect = contentHeight / contentWidth;

  // find all possible ways to grid
  const grids = [];
  for (let ii = 1; ii <= n; ii += 1) {
    if (n / ii === Math.floor(n / ii)) {
      grids.push([ii, n / ii]);
    }
  }

  // find difference between total area and that of laying out
  // panels according to the different grid choices
  const areaDiff = [];
  const totArea = contentWidth * contentHeight;
  grids.forEach((grd, ii) => {
    const nRow = grd[0];
    const nCol = grd[1];
    const gridAspect = (grd[1] / grd[0]) * contentAspect;
    const gridWidth = contentWidth / nCol;
    const gridHeight = contentHeight / nRow;
    let runningTotal = 0;
    for (let j = 0; j < nRow * nCol; j += 1) {
      const curDispAspect = displayInfo[disps[j]].height / displayInfo[disps[j]].width;
      let curWidth = gridWidth;
      let curHeight = curWidth * curDispAspect;
      if (gridAspect < curDispAspect) {
        curHeight = gridHeight;
        curWidth = curHeight / curDispAspect;
      }
      runningTotal += curWidth * curHeight;
    }
    areaDiff[ii] = totArea - runningTotal;
  });

  const curGrid = grids[areaDiff.indexOf(Math.min.apply(null, areaDiff))];

  // // now move the boxes to appropriate position
  // // make them appropriate size
  // // and give them appropriate labels (group / name)
  const nRow = curGrid[0];
  const nCol = curGrid[1];
  const gridAspect = (curGrid[1] / curGrid[0]) * contentAspect;
  const gridWidth = (contentWidth / contentHeight) / nCol;
  const gridHeight = 1 / nRow;

  const relDispPositions = disps.map((didx, ii) => {
    const row = Math.floor(ii / nCol);
    const col = ii % nCol;
    const aspect = displayInfo[didx].height / displayInfo[didx].width;
    let width = gridWidth;
    let height = width * aspect;
    if (gridAspect < aspect) {
      height = gridHeight;
      width = height / aspect;
    }

    return ({
      idx: didx,
      name: displayInfo[didx].name,
      group: displayInfo[didx].group,
      aspect,
      left: col * gridWidth,
      top: row * gridHeight,
      width,
      height,
      row,
      col
    });
  });

  if (relDispPositions.length === 1 && relDispPositions[0].name === selectedDisplay.name) {
    return [];
  }

  return relDispPositions;
};

const mapDispatchToProps = (dispatch) => ({
  handleCheckbox: (i, selectedRelDisps, selectedDisplay, di,
    contentHeight, contentWidth, cfg, appId) => {
    const checked = selectedRelDisps.indexOf(i) > -1;
    const newRelDisps = Object.assign([], selectedRelDisps);
    if (checked) {
      const idx = newRelDisps.indexOf(i);
      if (idx > -1) {
        newRelDisps.splice(idx, 1);
      }
    } else if (newRelDisps.indexOf(i) < 0) {
      // if it is being checked we also need to load the display
      dispatch(fetchDisplay(di[i].name, di[i].group, cfg, appId, '', false));
      newRelDisps.push(i);
    }
    newRelDisps.sort();

    const relDispPositions = getRelDispPositions(
      selectedDisplay, newRelDisps, di, contentHeight, contentWidth
    );

    dispatch(setLayout({ nrow: 1, ncol: 1 })); // related displays only works in 1/1 mode
    dispatch(setSelectedRelDisps(newRelDisps));
    dispatch(setRelDispPositions(relDispPositions));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(DisplayList));
