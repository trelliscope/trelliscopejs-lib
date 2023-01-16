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
import { setDispSelectDialogOpen } from '../../slices/appSlice';
import { FilterState, clearFilters, setFilterView } from '../../slices/filterSlice';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import type { LayoutAction } from '../../slices/layoutSlice';
import { setActiveSidebar } from '../../slices/sidebarSlice';
import { fullscreenSelector, selectedDisplaySelector, dispSelectDialogSelector } from '../../selectors';
import { setSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import { setSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import { useDisplayList } from '../../slices/displayListAPI';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import styles from './DisplaySelect.module.scss';

interface DisplaySelectProps {
  setDialogOpen: (isOpen: boolean) => void;
}

const DisplaySelect: React.FC<DisplaySelectProps> = ({ setDialogOpen }) => {
  const dispatch = useDispatch();
  const selectedDisplay = useSelector(selectedDisplaySelector);
  const fullscreen = useSelector(fullscreenSelector);
  const isOpen = useSelector(dispSelectDialogSelector);
  const [btnScale, setBtnScale] = useState(1);
  const [attnCircle, setAttnCircle] = useState<HTMLElement>();
  const [selectedDisplayName, setSelectedDisplayName] = useState('');
  const { data: displayList, isSuccess } = useDisplayList();
  const { data: displayInfo } = useDisplayInfo();

  const stateLayout = displayInfo?.state?.layout;
  const stateLabels = displayInfo?.state?.labels?.varnames;
  const activeDisplayName = displayInfo?.name;

  // This is needed to make sure the default state is applied when switching to a new display
  useEffect(() => {
    if (selectedDisplayName === activeDisplayName) {
      dispatch(setLayout(stateLayout as LayoutAction));
      dispatch(setLabels(stateLabels as string[]));
    }
  }, [stateLabels, stateLayout, dispatch, selectedDisplayName, activeDisplayName]);

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

  const handleClick = (name: string) => {
    // need to clear out state for new display...
    // first close sidebars for safety
    // (there is an issue when the filter sidebar stays open when changing - revisit this)
    dispatch(setActiveSidebar(''));
    dispatch(setSelectedRelDisps([]));
    dispatch(setFilterView({ name: { active: [], inactive: [] } as FilterState['view'] }));
    dispatch(clearFilters());
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));
    dispatch(setSelectedDisplay(name));
    setSelectedDisplayName(name);
  };

  const handleKey = () => {
    setDialogOpen(true);
    handleDispDialogOpen(true);
  };

  useHotkeys('o', handleKey, { enabled: fullscreen && !isOpen });
  useHotkeys('o', handleClose, { enabled: fullscreen && isOpen });
  useHotkeys('esc', handleClose, { enabled: isOpen });

  const handleSelect = (name: string) => {
    handleClick(name);
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
          <DisplayList displayItems={displayList as IDisplayListItem[]} handleClick={handleSelect} selectable={false} />
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
