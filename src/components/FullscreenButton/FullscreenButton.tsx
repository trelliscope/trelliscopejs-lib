import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';
import { addClass, removeClass } from '../../classManipulation';
import { fullscreenSelector, singlePageAppSelector } from '../../selectors';
import { setFullscreen } from '../../slices/appSlice';
import { windowResize } from '../../slices/uiSlice';
import { origHeightSelector, origWidthSelector } from '../../selectors/ui';
import styles from './FullscreenButton.module.scss';

const FullscreenButton: React.FC = () => {
  const dispatch = useDispatch();
  const fullscreen = useSelector(fullscreenSelector);
  const singlePageApp = useSelector(singlePageAppSelector);
  const ww = useSelector(origWidthSelector);
  const hh = useSelector(origHeightSelector);
  const originalDims = { width: ww, height: hh };

  const mainEl = document.getElementsByClassName('trelliscope-not-spa')[0] as HTMLElement;
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen();
      addClass(mainEl, 'trelliscope-spa');
      dispatch(setFullscreen(true));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      removeClass(mainEl, 'trelliscope-spa');
      dispatch(setFullscreen(false));
      dispatch(windowResize(originalDims));
    }
  };

  const handleNativeKeyEsc = useCallback(() => {
    if (!document.fullscreenElement) {
      removeClass(mainEl, 'trelliscope-spa');
      dispatch(setFullscreen(false));
      dispatch(windowResize(originalDims));
    }
  }, [dispatch, mainEl]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleNativeKeyEsc);
    return () => {
      document.removeEventListener('fullscreenchange', handleNativeKeyEsc);
    };
  }, [handleNativeKeyEsc]);

  if (singlePageApp) {
    return null;
  }

  return (
    <button type="button" className={styles.fullscreenButton} onClick={toggleFullScreen}>
      <div className={styles.fullscreenButtonIcon}>
        {!fullscreen ? <FontAwesomeIcon icon={faMaximize} size="lg" /> : <FontAwesomeIcon icon={faMinimize} size="lg" />}
      </div>
    </button>
  );
};

export default FullscreenButton;
