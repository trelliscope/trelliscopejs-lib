import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { addClass, removeClass } from '../../classManipulation';
import { fullscreenSelector } from '../../selectors';
import { setFullscreen } from '../../slices/appSlice';
import { windowResize } from '../../slices/uiSlice';
import { origHeightSelector, origWidthSelector } from '../../selectors/ui';
// import styles from './FullscreenButton.module.scss';

const FullscreenButton: React.FC = () => {
  const dispatch = useDispatch();
  const fullscreen = useSelector(fullscreenSelector);
  // const singlePageApp = useSelector(singlePageAppSelector);
  const ww = useSelector(origWidthSelector);
  const hh = useSelector(origHeightSelector);
  const originalDims = useMemo(() => ({ width: ww, height: hh }), [ww, hh]);

  const mainEl = document.getElementsByClassName('trelliscope-not-spa')[0] as HTMLElement;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const toggleFullScreen = () => {
    if (isSafari) {
      if (!document.webkitFullscreenElement) {
        document.body.webkitRequestFullscreen();
        if (mainEl) {
          addClass(mainEl, 'trelliscope-spa');
        }
        dispatch(setFullscreen(true));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        if (mainEl) {
          removeClass(mainEl, 'trelliscope-spa');
        }
        dispatch(setFullscreen(false));
        dispatch(windowResize(originalDims));
      }
      return;
    }
    if (!document.fullscreenElement) {
      document.body.requestFullscreen();
      if (mainEl) {
        addClass(mainEl, 'trelliscope-spa');
      }
      dispatch(setFullscreen(true));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      if (mainEl) {
        removeClass(mainEl, 'trelliscope-spa');
      }
      dispatch(setFullscreen(false));
      dispatch(windowResize(originalDims));
    }
  };

  const handleNativeKeyEsc = useCallback(() => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (mainEl) {
        removeClass(mainEl, 'trelliscope-spa');
      }
      dispatch(setFullscreen(false));
      dispatch(windowResize(originalDims));
    }
  }, [dispatch, mainEl, originalDims]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleNativeKeyEsc);
    if (isSafari) {
      document.addEventListener('webkitfullscreenchange', handleNativeKeyEsc);
    }
    return () => {
      document.removeEventListener('fullscreenchange', handleNativeKeyEsc);
      if (isSafari) {
        document.removeEventListener('webkitfullscreenchange', handleNativeKeyEsc);
      }
    };
  }, [handleNativeKeyEsc, isSafari]);

  // if (singlePageApp) {
  //   return null;
  // }

  return (
    <Tooltip title="Toggle Fullscreen">
      <IconButton data-testid="fullscreen-button" onClick={toggleFullScreen} color="inherit">
        {!fullscreen ? <FontAwesomeIcon icon={faExpand} size="sm" /> : <FontAwesomeIcon icon={faCompress} size="sm" />}
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenButton;
