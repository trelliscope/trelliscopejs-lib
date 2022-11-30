import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { addClass, removeClass } from '../../classManipulation';
import { dialogOpenSelector, fullscreenSelector, appIdSelector, singlePageAppSelector } from '../../selectors';
import { origWidthSelector, origHeightSelector } from '../../selectors/ui';
import { setFullscreen } from '../../slices/appSlice';
import { windowResize } from '../../slices/uiSlice';
import styles from './FullscreenButton.module.scss';

interface NewDims {
  width: number;
  height: number;
}

const FullscreenButton: React.FC = () => {
  const dispatch = useDispatch();
  const dialog = useSelector(dialogOpenSelector);
  const fullscreen = useSelector(fullscreenSelector);
  const appId = useSelector(appIdSelector);
  const singlePageApp = useSelector(singlePageAppSelector);
  const ww = useSelector(origWidthSelector);
  const hh = useSelector(origHeightSelector);
  let yOffset = window.pageYOffset;

  const toggleFullscreen = (
    fullscreenToggled: boolean,
    fullscreenAppId: string,
    appDims: { width: number; height: number },
    fullscreenYOffset: number,
  ) => {
    const el = document.getElementById(fullscreenAppId) as HTMLElement;
    const newDims = { width: 0, height: 0 } as NewDims;
    if (fullscreenToggled) {
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
      window.scrollTo(window.pageXOffset, fullscreenYOffset);
    }
    dispatch(setFullscreen(fullscreenToggled));
    dispatch(windowResize(newDims));
  };

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
      <div className={styles.fullscreenButtonIcon}>
        {!fullscreen ? <FontAwesomeIcon icon={faMaximize} size="lg" /> : <FontAwesomeIcon icon={faMinimize} size="lg" />}
      </div>
    </button>
  );
};

export default FullscreenButton;
