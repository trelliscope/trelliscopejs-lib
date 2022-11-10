import React, { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { connect } from 'react-redux';
import type { Action } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DisplayList from '../DisplayList';
import { fetchDisplay, resetRelDisps } from '../../actions';
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
  singlePageAppSelector,
  dispSelectDialogSelector,
} from '../../selectors';
import type { RootState } from '../../store';
import { setSelectedDisplay } from '../../slices/selectedDisplaySlice';
import type { SelectedDisplayState } from '../../slices/selectedDisplaySlice';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import styles from './DisplaySelect.module.scss';

interface DisplaySelectProps {
  handleClick: (name: string, group: string, desc: string, cfg: Config, appId: string) => void;
  setDialogOpen: (isOpen: boolean) => void;
  setDispDialogOpen: (isOpen: boolean) => void;
  cfg: Config;
  fullscreen: boolean;
  isOpen: boolean;
  appId: string;
  selectedDisplay: SelectedDisplayState;
  displayList: DisplaySelect;
  displayGroups: DisplayGroup;
}

const DisplaySelect: React.FC<DisplaySelectProps> = ({
  handleClick,
  setDialogOpen,
  setDispDialogOpen,
  cfg,
  fullscreen,
  isOpen,
  appId,
  selectedDisplay,
  displayList,
  displayGroups,
}) => {
  const [btnScale, setBtnScale] = useState(1);
  const [attnCircle, setAttnCircle] = useState<HTMLElement>();

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setDispDialogOpen(false);
  }, [setDialogOpen, setDispDialogOpen]);

  useHotkeys('esc', handleClose, { enabled: isOpen });

  const handleOpen = () => {
    if (displayList && displayList.isLoaded) {
      setDialogOpen(true);
      setDispDialogOpen(true);
    }
  };

  const handleKey = useCallback(() => {
    setDialogOpen(true);
    setDispDialogOpen(true);
  }, [setDialogOpen, setDispDialogOpen]);

  useHotkeys('o', handleKey, { enabled: fullscreen });

  const handleSelect = (name: string, group: string, desc: string) => {
    handleClick(name, group, desc, cfg, appId);
    setDialogOpen(false);
    setDispDialogOpen(false);
  };

  useEffect(() => {
    const attnInterval = setInterval(() => {
      const elem = attnCircle as HTMLDivElement | undefined;
      if (selectedDisplay.name !== '') {
        clearInterval(attnInterval);
      }
      if (elem) {
        elem.style.transform = `scale(${btnScale})`;
        setBtnScale(btnScale === 1 ? 0.85 : 1);
      }
    }, 750);
  }, []);

  const isLoaded = displayList && displayList.isLoaded;

  return (
    <div>
      <button
        type="button"
        aria-label="display select open"
        onClick={handleOpen}
        className={classNames({ [styles.displaySelectButton]: true, [styles.displaySelectButtonInactive]: !isLoaded })}
      >
        {(selectedDisplay.name === '' || !isOpen) && (
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
        <i className={`icon-folder-open ${styles.displaySelectFolderIcon}`} />
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
            displayItems={displayList.list}
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

// ------ redux container ------

const styleSelector = createSelector(
  selectedDisplaySelector,
  displayListSelector,
  displayGroupsSelector,
  configSelector,
  appIdSelector,
  singlePageAppSelector,
  fullscreenSelector,
  dispSelectDialogSelector,
  (selectedDisplay, displayList, displayGroups, cfg, appId, singlePageApp, fullscreen, isOpen) => ({
    appId,
    cfg,
    selectedDisplay,
    displayList,
    displayGroups,
    singlePageApp,
    fullscreen,
    isOpen,
  }),
);

const mapStateToProps = (state: RootState) => styleSelector(state);

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, unknown, Action>) => ({
  handleClick: (name: string, group: string, desc: string, cfg: Config, appId: string) => {
    // need to clear out state for new display...
    // first close sidebars for safety
    // (there is an issue when the filter sidebar stays open when changing - revisit this)
    dispatch(setActiveSidebar(''));
    dispatch(resetRelDisps());
    dispatch(setLabels([]));
    dispatch(setLayout({ nrow: 1, ncol: 1, arrange: 'row' }));
    dispatch(setLayout({ pageNum: 1 }));
    dispatch(setFilterView({ name: { active: [], inactive: [] } as FilterState['view'] }));
    dispatch(setFilter({}));
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));
    dispatch(setSelectedDisplay({ name, group, desc }));
    dispatch(fetchDisplay(name, group, cfg, appId, ''));
  },
  setDispDialogOpen: (isOpen: boolean) => {
    dispatch(setDispSelectDialogOpen(isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplaySelect);
