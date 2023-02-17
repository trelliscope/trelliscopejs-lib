import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import Checkbox from '@mui/material/Checkbox';
import { setLayout } from '../../slices/layoutSlice';
import { selectSelectedRelDisps, setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import { useDisplayGroups } from '../../slices/displayListAPI';
import { selectBasePath } from '../../selectors/app';
import styles from './DisplayList.module.scss';

interface DisplayListProps {
  selectable: boolean;
  displayItems: IDisplayListItem[];
  handleClick: (name: string) => void;
  excludedDisplays?: string[];
}

const DisplayList: React.FC<DisplayListProps> = ({ selectable, displayItems, handleClick, excludedDisplays }) => {
  const dispatch = useDispatch();
  const selectedRelDisps = useSelector(selectSelectedRelDisps);
  const basePath = useSelector(selectBasePath);
  const displayGroups = useDisplayGroups(excludedDisplays);

  const groupKeys = Array.from(displayGroups.keys());

  const handleCheckbox = (i: number) => {
    const checked = selectedRelDisps.indexOf(i) > -1;
    const newRelDisps = Object.assign([], selectedRelDisps);
    if (checked) {
      const idx = newRelDisps.indexOf(i);
      if (idx > -1) {
        newRelDisps.splice(idx, 1);
      }
    } else if (newRelDisps.indexOf(i) < 0) {
      // if it is being checked we also need to load the display
      newRelDisps.push(i);
    }
    newRelDisps.sort();

    dispatch(
      setLayout({
        nrow: 1,
        ncol: 1,
        type: 'layout',
      }),
    ); // related displays only works in 1/1 mode
    dispatch(setSelectedRelDisps(newRelDisps));
  };

  return (
    <div className={styles.displayListContainer}>
      {groupKeys.map((groupName) => (
        <div className={styles.displayListGroupContainer} key={groupName.toString()}>
          <ImageList rowHeight={180} cols={3} className={styles.displayListGridList}>
            {groupKeys.length > 1 ? (
              <ImageListItem key="Subheader" cols={3} style={{ height: 'auto' }}>
                <ListSubheader style={{ fontSize: 20, color: 'black' }} component="div">
                  {typeof groupName === 'symbol' ? '' : groupName}
                </ListSubheader>
              </ImageListItem>
            ) : null}
            {displayGroups.get(groupName)?.map((i: number) => (
              <ImageListItem
                key={i}
                className={styles.displayListGridTile}
                onClick={() => {
                  if (selectable) {
                    handleCheckbox(i);
                  } else {
                    handleClick(displayItems[i]?.name || '');
                  }
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${basePath}/${displayItems[i]?.thumbnailurl}`}
                  alt={displayItems[i]?.name}
                  className={styles.displayListImg}
                  key={`img${i}`}
                />
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
                  title={<div className={styles.displayListGridTitle}>{displayItems[i]?.name.replace(/_/g, ' ')}</div>}
                  subtitle={
                    <span style={{ fontSize: 13 }}>
                      {displayItems[i]?.description}
                      <br />
                    </span>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      ))}
    </div>
  );
};

DisplayList.defaultProps = {
  excludedDisplays: [],
};

export default DisplayList;
