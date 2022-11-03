import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { useHotkeys } from 'react-hotkeys-hook';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Rnd } from 'react-rnd';
import type { Position } from 'react-rnd';
import classNames from 'classnames';
import DisplayList from '../DisplayList';
import { relatedDisplayGroupsSelector, selectedRelDispsSelector } from '../../selectors/display';
import { contentHeightSelector, contentWidthSelector } from '../../selectors/ui';
import { selectedDisplaySelector, displayListSelector } from '../../selectors';
import uiConsts from '../../assets/styles/uiConsts';
import type { RootState } from '../../store';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import type { RelDispPositionsState } from '../../slices/relDispPositionsSlice';
import styles from './RelatedDisplays.module.scss';

const previewHeight = 400;

const fixCSS = (value: string) => parseInt(value.replace('px', ''), 10);

interface RelatedDisplaysProps {
  displayList: DisplaySelect;
  relatedDisplayGroups: DisplayGroup;
  setDialogOpen: (isOpen: boolean) => void;
  active: boolean;
  selectedRelDisps: number[];
  contentHeight: number;
  contentWidth: number;
  relDispPositions: RelDispPositionsState[];
  handleResize: (
    pos: RelDispPositionsState,
    relDispPositions: RelDispPositionsState[],
    x: number,
    y: number,
    width: number,
    height: number,
    prvwHeight: number,
  ) => void;
  propStyles: { [key: string]: CSSProperties };
}

const RelatedDisplays: React.FC<RelatedDisplaysProps> = ({
  displayList,
  relatedDisplayGroups,
  setDialogOpen,
  active,
  selectedRelDisps,
  contentHeight,
  contentWidth,
  relDispPositions,
  handleResize,
  propStyles,
}) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleOpen = () => {
    setDialogOpen(true);
    setOpen(true);
  };

  const handleKey = () => {
    setDialogOpen(true);
    setOpen(true);
  };
  useHotkeys('r', handleKey, { enabled: active });

  const handleClose = () => {
    setDialogOpen(false);
    setOpen(false);
  };

  useHotkeys('esc', handleClose, { enabled: open });

  const setStep = (step: number) => {
    setActiveStep(step);
  };

  const parentBoundary = {
    position: 'relative',
    background: '#efefef',
    width: previewHeight * (contentWidth / contentHeight),
    height: previewHeight,
    marginLeft: 'auto',
    marginRight: 'auto',
  } as CSSProperties;

  const stepContent = [
    <DisplayList displayItems={displayList.list} displayGroups={relatedDisplayGroups} handleClick={() => {}} selectable />,
    <div style={parentBoundary}>
      {relDispPositions.map((d) => (
        <Rnd
          key={d.name}
          className={styles.relatedDisplaysBoxStyle}
          default={{
            width: previewHeight * d.width,
            height: previewHeight * d.height,
            x: previewHeight * d.left,
            y: previewHeight * d.top,
          }}
          bounds="parent"
          lockAspectRatio
          onDragStop={(e, a) => {
            handleResize(d, relDispPositions, a.x, a.y, previewHeight * d.width, previewHeight * d.height, previewHeight);
          }}
          onResizeStop={(e, direction, ref: HTMLElement, delta, position: Position) => {
            handleResize(
              d,
              relDispPositions,
              position.x,
              position.y,
              fixCSS(ref.style.width),
              fixCSS(ref.style.height),
              previewHeight,
            );
          }}
        >
          <div className={styles.relatedDisplaysTrHandle} />
          <div className={styles.relatedDisplaysTlHandle} />
          <div className={styles.relatedDisplaysBrHandle} />
          <div className={styles.relatedDisplaysBlHandle} />
          {d.name}
        </Rnd>
      ))}
    </div>,
  ];

  return (
    <div>
      <button type="button" onClick={handleOpen} className={styles.relatedDisplaysButton} style={propStyles.button}>
        <i className={classNames('icon-open-add', styles.relatedDisplaysButtonIcon)}>
          <Badge
            className={styles.relatedDisplaysBadge}
            classes={{ badge: styles.relatedDisplaysBadgeCircle }}
            badgeContent={selectedRelDisps.length}
          />
        </i>
      </button>
      <Dialog
        open={open}
        className={classNames('trelliscope-app', styles.relatedDisplaysDialog)}
        onClose={handleClose}
        aria-labelledby="dialog-reldisp-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="dialog-reldisp-title">View Related Displays Simultaneously</DialogTitle>
        <DialogContent>
          <div>
            <Stepper alternativeLabel nonLinear activeStep={activeStep}>
              <Step>
                <StepButton onClick={() => setStep(0)}>
                  {`Select related displays (${selectedRelDisps.length} selected)`}
                </StepButton>
              </Step>
              <Step>
                <StepButton onClick={() => setStep(1)} disabled={activeStep === 0 && selectedRelDisps.length === 0}>
                  Arrange Panel Layout
                </StepButton>
              </Step>
            </Stepper>
            <div>{stepContent[activeStep]}</div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className={styles.relatedDisplaysDialogActionText}>
            <Button
              onClick={() => setStep(activeStep === 1 ? 0 : 1)}
              className={styles.relatedDisplaysButtonDialog}
              disabled={activeStep === 0 && selectedRelDisps.length === 0}
            >
              {activeStep === 0 ? '' : <ChevronLeftIcon />}
              {activeStep === 0 ? 'Set Layout' : 'Select Displays'}
              {activeStep === 0 ? <ChevronRightIcon /> : ''}
            </Button>
          </div>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// ------ redux container ------

const relDispPositionsSelector = (state: RootState) => state.relDispPositions;

const styleSelector = createSelector(
  displayListSelector,
  selectedDisplaySelector,
  relatedDisplayGroupsSelector,
  contentHeightSelector,
  contentWidthSelector,
  selectedRelDispsSelector,
  relDispPositionsSelector,
  (dl, sd, rdg, ch, cw, srd, rdp) => ({
    propStyles: {
      button: {
        left: uiConsts.header.height * (sd.name === '' || Object.keys(rdg).length === 0 ? 0 : 2) - 1,
        background: srd.length === 0 ? 'none' : 'rgba(69, 138, 249, 0.4)',
        color: srd.length === 0 ? uiConsts.header.button.color : 'white',
      },
    },
    displayList: dl,
    relatedDisplayGroups: rdg,
    active: Object.keys(rdg).length > 0,
    contentHeight: ch,
    contentWidth: cw,
    selectedRelDisps: srd,
    relDispPositions: rdp,
  }),
);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleResize: (
    pos: RelDispPositionsState,
    relDispPositions: RelDispPositionsState[],
    x: number,
    y: number,
    width: number,
    height: number,
    prvwHeight: number,
  ) => {
    const names = relDispPositions.map((d) => d.name);
    const idx = names.indexOf(pos.name);
    const newPos = { ...pos };
    newPos.left = x / prvwHeight;
    newPos.top = y / prvwHeight;

    if (width) {
      newPos.width = width / prvwHeight;
    }
    if (height) {
      newPos.height = height / prvwHeight;
    }
    const newPositions = { ...relDispPositions };
    newPositions[idx] = newPos;
    dispatch(setRelDispPositions(newPositions));
  },
});

const mapStateToProps = (state: RootState) => styleSelector(state);

export default connect(mapStateToProps, mapDispatchToProps)(RelatedDisplays);
