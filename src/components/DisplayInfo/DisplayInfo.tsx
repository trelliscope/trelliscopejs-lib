import React, { useEffect } from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import marked from 'marked';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import {
  selectedDisplaySelector,
  curDisplayInfoSelector,
  fullscreenSelector,
  dispInfoDialogSelector,
} from '../../selectors';
import { setDispInfoDialogOpen } from '../../actions';
import type { RootState } from '../../store';
import styles from './DisplayInfo.module.scss';

interface DisplayInfoProps {
  singleDisplay: boolean;
  curDisplayInfo: CurrentDisplayInfo;
  isOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  setThisDialogOpen: (isOpen: boolean) => void;
  fullscreen: boolean;
  active: boolean;
}

const DisplayInfo: React.FC<DisplayInfoProps> = ({
  curDisplayInfo,
  singleDisplay,
  isOpen,
  setDialogOpen,
  setThisDialogOpen,
  fullscreen,
  active,
}) => {
  const handleClose = () => {
    setDialogOpen(false);
    setThisDialogOpen(false);
    Mousetrap.unbind('esc');
  };
  const handleOpen = () => {
    setDialogOpen(true);
    setThisDialogOpen(true);
    Mousetrap.bind('esc', handleClose);
  };

  const handleKey = () => {
    setDialogOpen(true);
    setThisDialogOpen(true);
    Mousetrap.bind('esc', handleClose);
  };

  const moptions = {
    passoverHTML: false,
    passoverAttribute: 'passover',
    stripPassoverAttribute: true,
  };

  useEffect(() => {
    if (active && fullscreen) {
      Mousetrap.bind('i', handleKey);
    }
    return () => {
      Mousetrap.unbind('i');
    };
  }, [active, fullscreen]);
  return (
    <div>
      <button
        type="button"
        aria-label="display info open"
        onClick={handleOpen}
        className={classNames(
          singleDisplay ? [styles.displayInfoButton, styles.displayInfoButtonLeft] : styles.displayInfoButton,
        )}
      >
        <i className={classNames(styles.displayInfoIcon, 'icon-info_outline')} />
      </button>
      <Dialog
        open={isOpen}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-info-title"
        onClose={handleClose}
        disableEscapeKeyDown
        maxWidth="md"
      >
        <DialogTitle id="dialog-info-title">{`${curDisplayInfo.info.mdTitle}`}</DialogTitle>
        <DialogContent>
          <div className={styles.displayInfoModalContainer}>
            <div>
              <div style={{ background: '#ededed', padding: 5 }}>
                <strong>{curDisplayInfo.info.name}</strong>
                <br />
                {curDisplayInfo.info.desc && <em>{curDisplayInfo.info.desc}</em>}
              </div>
              <p>
                {`This visualization contains ${curDisplayInfo.info.n} "panels" that you can interactively view through various controls. Each panel has a set of variables or metrics, called "cognostics", that you can use to sort and filter the panels that you want to view.`}
              </p>
              <p>
                To learn more about how to interact with this visualization, click the &ldquo;?&rdquo; icon in the top right
                corner of the display.
              </p>
              {curDisplayInfo.info.has_inputs && (
                <p>
                  There are user input variables available in this visualization with which you can provide feedback for any
                  panel. These will show up as either a radio button or free text entry in the labels that show up under each
                  panel. As you enter inputs, these are saved in your local web browser&apos;s storage and will be remembered
                  in subsequent views of the display.
                </p>
              )}
              {curDisplayInfo.info.has_inputs && (
                <p>
                  If you&apos;d like to pull the data that you have input, you can click the &ldquo;Export Inputs&rdquo;
                  button at the bottom left corner of the display and follow the prompts in the dialog box that pops up.
                </p>
              )}
            </div>
            {curDisplayInfo.isLoaded && (
              <div
                // we can dangerously set because the HTML is generated from marked()
                // with pure markdown (sanitize = TRUE so user HTML is not supported)
                // These ignores are needed because marked is a 3rd party library that is having type issues.
                // Even after installing the type dependencies, the issue persists.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: TS2345
                dangerouslySetInnerHTML={{ __html: marked(curDisplayInfo.info.mdDesc, moptions) }} // eslint-disable-line react/no-danger
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button aria-label="display info close" color="secondary" onClick={handleClose}>
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
  curDisplayInfoSelector,
  fullscreenSelector,
  dispInfoDialogSelector,
  (selectedDisplay, curDisplayInfo, fullscreen, isOpen) => ({
    curDisplayInfo,
    fullscreen,
    active: selectedDisplay.name !== '',
    isOpen,
  }),
);

const mapStateToProps = (state: RootState) => styleSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setThisDialogOpen: (isOpen: boolean) => {
    dispatch(setDispInfoDialogOpen(isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayInfo);
