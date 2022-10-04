import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Action, Dispatch } from 'redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { addClass, removeClass } from '../../classManipulation';
import { fullscreenSelector, appIdSelector, singlePageAppSelector } from '../../selectors';
import { origWidthSelector, origHeightSelector } from '../../selectors/ui';
import { setFullscreen, windowResize } from '../../actions';
import { RootState } from '../../store';
import styles from './FullscreenButton.module.scss';

interface FullscreenButtonProps {
  fullscreen: boolean;
  appId: string;
  singlePageApp: boolean;
  ww: number;
  hh: number;
  toggleFullscreen: (
    fullscreen: boolean,
    appId: string,
    appDims: { width: number; height: number },
    yOffset: number,
  ) => void;
}

interface NewDims {
  width: number;
  height: number;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  fullscreen,
  appId,
  singlePageApp,
  ww,
  hh,
  toggleFullscreen,
}) => {
  let yOffset = window.pageYOffset;

  // console.log(sidebar, 'sidebar');
  // console.log(dialog, 'dialog');
  // console.log(fullscreen, 'fullscreen');
  // console.log(appId, 'appId');
  // console.log(singlePageApp, 'SPA');
  // console.log(ww, 'ww');
  // console.log(hh, 'hh');

  useHotkeys('esc', () => toggleFullscreen(false, appId, { width: ww, height: hh }, yOffset));

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
  fullscreenSelector,
  appIdSelector,
  singlePageAppSelector,
  origWidthSelector,
  origHeightSelector,
  (fullscreen, appId, singlePageApp, ww, hh) => ({
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
      parentId.appendChild(el);
      const fullscreenDiv = document.getElementById('trelliscope-fullscreen-div') as HTMLElement;
      fullscreenDiv.style.display = 'none';
      // restore to y offset we were at before going fullscreen
      window.scrollTo(window.pageXOffset, yOffset);
    }
    dispatch(setFullscreen(fullscreen));
    dispatch(windowResize(newDims));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenButton);
