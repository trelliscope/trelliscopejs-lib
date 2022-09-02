import React from 'react';
import { Action, Dispatch } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import { selectedRelDispsSelector } from '../../selectors/display';
import { appIdSelector, configSelector, selectedDisplaySelector } from '../../selectors';
import { contentHeightSelector, contentWidthSelector } from '../../selectors/ui';
import { setSelectedRelDisps, setRelDispPositions, setLayout, fetchDisplay } from '../../actions';
import { configPropTypes, displayPropTypes } from '../../commonPropTypes';
import styles from './DisplayList.module.scss';

// TODO this should probably live as a return type
// of `displayGroupSelector` once that file is converted to TS
type DisplayGroup = {
  [key in string]: number[];
};

interface DisplayListProps {
  selectable: boolean;
  displayItems: Display[];
  displayGroups: DisplayGroup;
  handleClick: (name: string, group: string, desc: string) => void;
  cfg: Config;
  appId: string;
  selectedDisplay: Display;
  selectedRelDisps: number[];
  handleCheckbox: (
    i: number,
    selectedRelDisps: number[],
    selectedDisplay: Display,
    displayItems: Display[],
    contentHeight: number,
    contentWidth: number,
    cfg: Config,
    appId: string,
  ) => void;
  contentHeight: number;
  contentWidth: number;
}

const DisplayList: React.FC<DisplayListProps> = ({
  selectable,
  displayItems,
  displayGroups,
  handleClick,
  cfg,
  appId,
  selectedDisplay,
  selectedRelDisps,
  handleCheckbox,
  contentHeight,
  contentWidth,
}) => {
  const groupKeys = Object.keys(displayGroups);

  return (
    <div className={styles.displayListContainer}>
      {groupKeys.map((groupName) => (
        <div className={styles.displayListGroupContainer} key={groupName}>
          <ImageList rowHeight={180} cols={3} className={styles.displayListGridList}>
            {groupKeys.length > 1 ? (
              <ImageListItem key="Subheader" cols={3} style={{ height: 'auto' }}>
                <ListSubheader style={{ fontSize: 20, color: 'black' }} component="div">
                  {groupName}
                </ListSubheader>
              </ImageListItem>
            ) : null}
            {displayGroups[groupName].map((i: number) => (
              <ImageListItem
                key={i}
                className={styles.displayListGridTile}
                onClick={() => {
                  if (selectable) {
                    handleCheckbox(
                      i,
                      selectedRelDisps,
                      selectedDisplay,
                      displayItems,
                      contentHeight,
                      contentWidth,
                      cfg,
                      appId,
                    );
                  } else {
                    handleClick(displayItems[i].name, displayItems[i].group, displayItems[i].desc);
                  }
                }}
              >
                <img
                  src={`${cfg.cog_server.info.base}/${displayItems[i]?.group}/${displayItems[i].name}/thumb.png`}
                  alt={displayItems[i].name}
                  className={styles.displayListImg}
                  key={`img${i}`}
                />

                {selectable && (
                  <Checkbox
                    className={styles.displayListCheckbox}
                    checked={selectedRelDisps.indexOf(i) > -1}
                    onChange={() => {
                      handleCheckbox(
                        i,
                        selectedRelDisps,
                        selectedDisplay,
                        displayItems,
                        contentHeight,
                        contentWidth,
                        cfg,
                        appId,
                      );
                    }}
                    value={`checked${i}`}
                  />
                )}
                <GridListTileBar
                  className={styles.displayListGridTileBar}
                  title={<div className={styles.displayListGridTitle}>{displayItems[i].name.replace(/_/g, ' ')}</div>}
                  subtitle={
                    <span style={{ fontSize: 13 }}>
                      {displayItems[i].desc}
                      <br />
                      <span className={styles.displayListGridSubtitle}>
                        {displayItems[i].n}
                        &nbsp;panels,
                        {displayItems[i].updated.substring(0, displayItems[i].updated.length - 3)}
                      </span>
                    </span>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      ))}
    </div>
  );
};

DisplayList.propTypes = {
  selectable: PropTypes.bool.isRequired,
  displayItems: PropTypes.arrayOf(displayPropTypes.isRequired).isRequired,
  displayGroups: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired).isRequired,
  handleClick: PropTypes.func.isRequired,
  cfg: configPropTypes.isRequired,
  appId: PropTypes.string.isRequired,
  selectedRelDisps: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  selectedDisplay: displayPropTypes.isRequired,
  contentHeight: PropTypes.number.isRequired,
  contentWidth: PropTypes.number.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
};

const styleSelector = createSelector(
  selectedDisplaySelector,
  selectedRelDispsSelector,
  configSelector,
  appIdSelector,
  contentHeightSelector,
  contentWidthSelector,
  (selectedDisplay, selectedRelDisps, cfg, appId, contentHeight, contentWidth) => ({
    selectedDisplay,
    selectedRelDisps,
    appId,
    cfg,
    contentHeight,
    contentWidth,
  }),
);

const mapStateToProps = (state: {
  selectedDisplaySelector: Display;
  selectedRelDispsSelector: number[];
  configSelector: Config;
  appIdSelector: string;
  contentHeightSelector: number;
  contentWidthSelector: number;
}) => styleSelector(state);

const getRelDispPositions = (
  selectedDisplay: Display,
  relDisps: number[],
  displayInfo: Display[],
  contentHeight: number,
  contentWidth: number,
) => {
  const dnames = displayInfo.map((d: Display) => d.name);
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
  const areaDiff = [] as number[];
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
  const gridWidth = contentWidth / contentHeight / nCol;
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

    return {
      idx: didx,
      name: displayInfo[didx].name,
      group: displayInfo[didx].group,
      aspect,
      left: col * gridWidth,
      top: row * gridHeight,
      width,
      height,
      row,
      col,
    };
  });

  if (relDispPositions.length === 1 && relDispPositions[0].name === selectedDisplay.name) {
    return [];
  }

  return relDispPositions;
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleCheckbox: (
    i: number,
    selectedRelDisps: number[],
    selectedDisplay: Display,
    displayItems: Display[],
    contentHeight: number,
    contentWidth: number,
    cfg: Config,
    appId: string,
  ) => {
    const checked = selectedRelDisps.indexOf(i) > -1;
    const newRelDisps = Object.assign([], selectedRelDisps);
    if (checked) {
      const idx = newRelDisps.indexOf(i);
      if (idx > -1) {
        newRelDisps.splice(idx, 1);
      }
    } else if (newRelDisps.indexOf(i) < 0) {
      // if it is being checked we also need to load the display
      // FIXME need to change the index.js actions file to be in typescript and return proper types for this method action
      // once complete remove eslint disable and ts ignore, it seems that its the way the fetchDisplay is structured it needs to have a return value
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(fetchDisplay(displayItems[i].name, displayItems[i].group, cfg, appId, '', false));
      newRelDisps.push(i);
    }
    newRelDisps.sort();

    const relDispPositions = getRelDispPositions(selectedDisplay, newRelDisps, displayItems, contentHeight, contentWidth);

    dispatch(setLayout({ nrow: 1, ncol: 1 })); // related displays only works in 1/1 mode
    dispatch(setSelectedRelDisps(newRelDisps));
    dispatch(setRelDispPositions(relDispPositions));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayList);
