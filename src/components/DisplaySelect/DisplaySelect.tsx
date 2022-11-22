import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DisplayList from '../DisplayList';
import { fetchDisplay } from '../../actions';
import { setDispSelectDialogOpen } from '../../slices/appSlice';
import { FilterState, setFilter, setFilterView } from '../../slices/filterSlice';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { setActiveSidebar } from '../../slices/sidebarSlice';
import { displayGroupsSelector } from '../../selectors/display';
import {
  appIdSelector,
  configSelector,
  displayListSelector,
  fullscreenSelector,
  selectedDisplaySelector,
  dispSelectDialogSelector,
} from '../../selectors';
import { setSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import styles from './DisplaySelect.module.scss';
import { useDisplayList } from '../../slices/displayListAPI';

interface DisplaySelectProps {
  setDialogOpen: (isOpen: boolean) => void;
}

const DisplaySelect: React.FC<DisplaySelectProps> = ({ setDialogOpen }) => {
  const dispatch = useDispatch();
  const selectedDisplay = useSelector(selectedDisplaySelector);
  const displayList = useSelector(displayListSelector);
  const displayGroups = useSelector(displayGroupsSelector);
  const appId = useSelector(appIdSelector);
  const cfg = useSelector(configSelector);
  const fullscreen = useSelector(fullscreenSelector);
  const isOpen = useSelector(dispSelectDialogSelector);

  const [btnScale, setBtnScale] = useState(1);
  const [attnCircle, setAttnCircle] = useState<HTMLElement>();
  const { data: displayList, isSuccess } = useDisplayList();

  console.log('DisplaySelect', displayList);

  const handleDispDialogOpen = (dispIsOpen: boolean) => {
    dispatch(setDispSelectDialogOpen(dispIsOpen));
  };

  const handleClose = () => {
    setDialogOpen(false);
    handleDispDialogOpen(false);
  };

  const handleOpen = () => {
    if (displayList && isSuccess) {
      setDialogOpen(true);
      handleDispDialogOpen(true);
    }
  };

  const handleClick = (name: string, group: string, desc: string) => {
    // need to clear out state for new display...
    // first close sidebars for safety
    // (there is an issue when the filter sidebar stays open when changing - revisit this)
    dispatch(setActiveSidebar(''));
    dispatch(setSelectedRelDisps([]));
    dispatch(setLabels([]));
    dispatch(setLayout({ nrow: 1, ncol: 1, arrange: 'row' }));
    dispatch(setLayout({ pageNum: 1 }));
    dispatch(setFilterView({ name: { active: [], inactive: [] } as FilterState['view'] }));
    dispatch(setFilter({}));
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));
    dispatch(setSelectedDisplay({ name, group, desc }));
    dispatch(fetchDisplay(name, group, cfg, appId, ''));
  };

  const handleKey = () => {
    setDialogOpen(true);
    handleDispDialogOpen(true);
  };

  useHotkeys('o', handleKey, { enabled: fullscreen && !isOpen });
  useHotkeys('o', handleClose, { enabled: fullscreen && isOpen });
  useHotkeys('esc', handleClose, { enabled: isOpen });

  const handleSelect = (name: string, group: string, desc: string) => {
    handleClick(name, group, desc);
    setDialogOpen(false);
    handleDispDialogOpen(false);
  };

  useEffect(() => {
    const attnInterval = setInterval(() => {
      const elem = attnCircle as HTMLDivElement | undefined;
      if (selectedDisplay !== '') {
        clearInterval(attnInterval);
      }
      if (elem) {
        elem.style.transform = `scale(${btnScale})`;
        setBtnScale(btnScale === 1 ? 0.85 : 1);
      }
    }, 750);
  }, []);

  return (
    <div>
      <button
        type="button"
        aria-label="display select open"
        onClick={handleOpen}
        className={classNames({ [styles.displaySelectButton]: true, [styles.displaySelectButtonInactive]: !isSuccess })}
      >
        {(selectedDisplay === '' || !isOpen) && (
          <div className={styles.displaySelectAttnOuter}>
            <div className={styles.displaySelectAttnInner}>
              <div
                ref={(d: HTMLDivElement) => {
                  setAttnCircle(d);
                }}
                className={styles.displaySelectAttnEmpty}
              />
            </div>
          </div>
        )}
        <div className={styles.displaySelectFolderIcon}>
          <FontAwesomeIcon icon={faFolder} />
        </div>
      </button>
      <Dialog
        open={isOpen}
        className="trelliscope-app"
        aria-labelledby="dialog-dispselect-title"
        onClose={handleClose}
        disableEscapeKeyDown
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="dialog-dispselect-title">Select a Display to Open</DialogTitle>
        <DialogContent>
          <DisplayList
            displayItems={displayList}
            displayGroups={displayGroups}
            handleClick={handleSelect}
            selectable={false}
          />
        </DialogContent>
        <DialogActions>
          <Button aria-label="display select close" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DisplaySelect;
