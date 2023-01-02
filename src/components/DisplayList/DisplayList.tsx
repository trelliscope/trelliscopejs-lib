import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import Checkbox from '@mui/material/Checkbox';
import { selectedRelDispsSelector } from '../../selectors/display';
import { appIdSelector, configSelector, selectedDisplaySelector } from '../../selectors';
import { contentHeightSelector, contentWidthSelector } from '../../selectors/ui';
import { fetchDisplay } from '../../actions';
import { setLayout } from '../../slices/layoutSlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import { useDisplayGroups } from '../../slices/displayListAPI';
import styles from './DisplayList.module.scss';

interface DisplayListProps {
  selectable: boolean;
  displayItems: IDisplayListItem[];
  handleClick: (name: string) => void;
}

const DisplayList: React.FC<DisplayListProps> = ({ selectable, displayItems, handleClick }) => {
  const dispatch = useDispatch();
  const selectedDisplay = useSelector(selectedDisplaySelector);
  const selectedRelDisps = useSelector(selectedRelDispsSelector);
  const cfg = useSelector(configSelector);
  const appId = useSelector(appIdSelector);
  const contentHeight = useSelector(contentHeightSelector);
  const contentWidth = useSelector(contentWidthSelector);
  const displayGroups = useDisplayGroups();
  const groupKeys = Object.keys(displayGroups);

  const getRelDispPositions = (relDisps: number[], displayInfo: IDisplay[]) => {
    const dnames = displayInfo.map((d: IDisplay) => d.name);
    const idx = dnames.indexOf(selectedDisplay);
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

  const handleCheckbox = (i: string) => {
    const checked = selectedRelDisps.indexOf(i) > -1;
    const newRelDisps = Object.assign([], selectedRelDisps);
    if (checked) {
      const idx = newRelDisps.indexOf(i);
      if (idx > -1) {
        newRelDisps.splice(idx, 1);
      }
    } else if (newRelDisps.indexOf(i) < 0) {
      // if it is being checked we also need to load the display
      dispatch(fetchDisplay(displayItems[i].name, displayItems[i].group, cfg, appId, '', false));
      newRelDisps.push(i);
    }
    newRelDisps.sort();

    const relDispPositions = getRelDispPositions(newRelDisps, displayItems);

    dispatch(
      setLayout({
        nrow: 1,
        ncol: 1,
        type: 'layout',
      }),
    ); // related displays only works in 1/1 mode
    dispatch(setSelectedRelDisps(newRelDisps));
    dispatch(setRelDispPositions(relDispPositions));
  };

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
            {displayGroups[groupName].map((i: string) => {
              const displayItem = displayItems.find((l) => l.name === i);
              return (
                <ImageListItem
                  key={i}
                  className={styles.displayListGridTile}
                  onClick={() => {
                    if (selectable) {
                      handleCheckbox(i);
                    } else {
                      handleClick(displayItem?.name || '');
                    }
                  }}
                >
                  {/* TODO: find a way to render a thumbnail based off of the first panel */}
                  {/* <img
                  src={`${cfg.cog_server.info.base}/displays/${displayItem.name}/thumb.png`}
                  alt={displayItem.name}
                  className={styles.displayListImg}
                  key={`img${i}`}
                /> */}
                  {selectable && (
                    <Checkbox
                      className={styles.displayListCheckbox}
                      checked={selectedRelDisps.indexOf(i) > -1}
                      onChange={() => {
                        handleCheckbox(i);
                      }}
                      value={`checked${i}`}
                    />
                  )}
                  <ImageListItemBar
                    className={styles.displayListGridTileBar}
                    title={<div className={styles.displayListGridTitle}>{displayItem?.name.replace(/_/g, ' ')}</div>}
                    subtitle={
                      <span style={{ fontSize: 13 }}>
                        {displayItem?.description}
                        <br />
                        <span className={styles.displayListGridSubtitle}>
                          {/* {displayItems[i].n} */}
                          &nbsp;panels,
                          {/* {displayItems[i].updated.substring(0, displayItems[i].updated.length - 3)} */}
                        </span>
                      </span>
                    }
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        </div>
      ))}
    </div>
  );
};

export default DisplayList;
