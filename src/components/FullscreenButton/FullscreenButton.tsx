import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import type { Action, Dispatch } from 'redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { addClass, removeClass } from '../../classManipulation';
import { dialogOpenSelector, fullscreenSelector, appIdSelector, singlePageAppSelector } from '../../selectors';
import { origWidthSelector, origHeightSelector } from '../../selectors/ui';
import { setFullscreen, windowResize } from '../../actions';
import type { RootState } from '../../store';
import styles from './FullscreenButton.module.scss';

interface NewDims {
  width: number;
  height: number;
}
interface FullscreenButtonProps {
  dialog: boolean;
  fullscreen: boolean;
  appId: string;
  singlePageApp: boolean;
  ww: number;
  hh: number;
  toggleFullscreen: (fullscreen: boolean, appId: string, appDims: NewDims, yOffset: number) => void;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  dialog,
  fullscreen,
  appId,
  singlePageApp,
  ww,
  hh,
  toggleFullscreen,
}) => {
  let yOffset = window.pageYOffset;

  useHotkeys('esc', () => toggleFullscreen(false, appId, { width: ww, height: hh }, yOffset), {
    enabled: fullscreen && !singlePageApp && !dialog,
  });

  if (singlePageApp) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.fullscreenButton}
      onClick={() => {
        if (!fullscreen) {
          // toggling to fullscreen
          yOffset = window.pageYOffset;
        }
        toggleFullscreen(!fullscreen, appId, { width: ww, height: hh }, yOffset);
      }}
    >
      <i className={classNames(styles.fullscreenButtonIcon, fullscreen ? 'icon-minimize' : 'icon-maximize')} />
    </button>
  );
};

// ------ redux container ------

const stateSelector = createSelector(
  dialogOpenSelector,
  fullscreenSelector,
  appIdSelector,
  singlePageAppSelector,
  origWidthSelector,
  origHeightSelector,
  (dialog, fullscreen, appId, singlePageApp, ww, hh) => ({
    dialog,
    fullscreen,
    appId,
    singlePageApp,
    ww,
    hh,
  }),
);

const mapStateToProps = (state: RootState) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleFullscreen: (fullscreen: boolean, appId: string, appDims: { width: number; height: number }, yOffset: number) => {
    const el = document.getElementById(appId) as HTMLElement;
    const newDims = {} as NewDims;
    if (fullscreen) {
      addClass(document.body, 'trelliscope-fullscreen-body');
      addClass(document.getElementsByTagName('html')[0], 'trelliscope-fullscreen-html');
      addClass(el, 'trelliscope-fullscreen-el');
      newDims.width = window.innerWidth;
      newDims.height = window.innerHeight;
      // move the div to the outside of the document to make sure it's on top
      const bodyEl = document.getElementById('trelliscope-fullscreen-div') as HTMLElement;
      bodyEl.style.display = 'block';
      bodyEl.appendChild(el);
    } else {
      removeClass(document.body, 'trelliscope-fullscreen-body');
      removeClass(document.getElementsByTagName('html')[0], 'trelliscope-fullscreen-html');
      removeClass(el, 'trelliscope-fullscreen-el');
      newDims.width = appDims.width;
      newDims.height = appDims.height;
      // move the div back to its parent element
      const parentId = document.getElementById(`${el.id}-parent`) as HTMLElement;
      if (parentId) {
        parentId.appendChild(el);
      }
      const fullscreenDiv = document.getElementById('trelliscope-fullscreen-div') as HTMLElement;
      if (fullscreenDiv) {
        fullscreenDiv.style.display = 'none';
      }
      // restore to y offset we were at before going fullscreen
      window.scrollTo(window.pageXOffset, yOffset);
    }
    dispatch(setFullscreen(fullscreen));
    dispatch(windowResize(newDims));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenButton);
