import React, { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DisplayList from '../DisplayList';
import {
  setSelectedDisplay,
  fetchDisplay,
  setActiveSidebar,
  setLabels,
  setLayout,
  setSort,
  setFilter,
  setFilterView,
  setDispSelectDialogOpen,
  resetRelDisps,
  setRelDispPositions,
} from '../../actions';
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
import styles from './DisplaySelect.module.scss';

interface DisplaySelectProps {
  handleClick: (name: string, group: string, desc: string, cfg: Config, appId: string) => void;
  setDialogOpen: (isOpen: boolean) => void;
  setDispDialogOpen: (isOpen: boolean) => void;
  cfg: Config;
  fullscreen: boolean;
  isOpen: boolean;
  appId: string;
  selectedDisplay: SelectedDisplay;
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: TS2345
const mapStateToProps = (state: RootState) => styleSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleClick: (name: string, group: string, desc: string, cfg: Config, appId: string) => {
    // need to clear out state for new display...
    // first close sidebars for safety
    // (there is an issue when the filter sidebar stays open when changing - revisit this)
    dispatch(setActiveSidebar(''));
    dispatch(resetRelDisps());
    dispatch(setLabels([]));
    dispatch(setLayout({ nrow: 1, ncol: 1, arrange: 'row' }));
    dispatch(setLayout({ pageNum: 1 }));
    dispatch(setFilterView({ active: [], inactive: [] }));
    dispatch(setFilter({}));
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));
    dispatch(setSelectedDisplay(name, group, desc));
    // FIXME need to change the index.js actions file to be in typescript and return proper types for this method action
    // once complete remove eslint disable and ts ignore, it seems that its the way the fetchDisplay is structured it needs to have a return value
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dispatch(fetchDisplay(name, group, cfg, appId, ''));
  },
  setDispDialogOpen: (isOpen: boolean) => {
    dispatch(setDispSelectDialogOpen(isOpen));
  },
});

// FIXME similar to the above this is throwing errors because the selector file needs to be typed.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: TS2345
export default connect(mapStateToProps, mapDispatchToProps)(DisplaySelect);
