import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Rnd } from 'react-rnd';
import type { Position } from 'react-rnd';
import classNames from 'classnames';
import DisplayList from '../DisplayList';
import { relatedDisplayGroupsSelector, selectedRelDispsSelector } from '../../selectors/display';
import { contentHeightSelector, contentWidthSelector } from '../../selectors/ui';
import { selectedDisplaySelector, displayListSelector, relDispPositionsSelector } from '../../selectors';
import { setRelDispPositions } from '../../slices/relDispPositionsSlice';
import type { RelDispPositionsState } from '../../slices/relDispPositionsSlice';
import getCustomProperties from '../../getCustomProperties';
import styles from './RelatedDisplays.module.scss';

const previewHeight = 400;

const fixCSS = (value: string) => parseInt(value.replace('px', ''), 10);

interface RelatedDisplaysProps {
  setDialogOpen: (isOpen: boolean) => void;
}

const RelatedDisplays: React.FC<RelatedDisplaysProps> = ({ setDialogOpen }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [headerHeight] = getCustomProperties(['--header-height']) as number[];

  const dispatch = useDispatch();
  const displayList = useSelector(displayListSelector);
  const selectedDisplay = useSelector(selectedDisplaySelector);
  const relatedDisplayGroups = useSelector(relatedDisplayGroupsSelector);
  const contentHeight = useSelector(contentHeightSelector);
  const contentWidth = useSelector(contentWidthSelector);
  const selectedRelDisps = useSelector(selectedRelDispsSelector);
  const relDispPositions = useSelector(relDispPositionsSelector);
  const propStyles = {
    button: {
      left: headerHeight * (selectedDisplay.name === '' || Object.keys(relatedDisplayGroups).length === 0 ? 0 : 2) - 1,
      background: selectedRelDisps.length === 0 ? 'none' : 'rgba(69, 138, 249, 0.4)',
      color: selectedRelDisps.length === 0 ? '#9ba3af' : 'white',
    },
  };
  const active = Object.keys(relatedDisplayGroups).length > 0;

  const handleResize = (
    pos: RelDispPositionsState,
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
  };

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
            handleResize(d, a.x, a.y, previewHeight * d.width, previewHeight * d.height, previewHeight);
          }}
          onResizeStop={(e, direction, ref: HTMLElement, delta, position: Position) => {
            handleResize(d, position.x, position.y, fixCSS(ref.style.width), fixCSS(ref.style.height), previewHeight);
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
        <div className={styles.relatedDisplaysButtonIcon}>
          <FontAwesomeIcon icon={faFolderPlus} size="lg" />
        </div>
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
            <Stepper className={styles.relatedDisplaysStepper} alternativeLabel nonLinear activeStep={activeStep}>
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
              {activeStep === 0 ? '' : <FontAwesomeIcon icon={faChevronLeft} />}
              {activeStep === 0 ? 'Set Layout' : 'Select Displays'}
              {activeStep === 0 ? <FontAwesomeIcon icon={faChevronRight} /> : ''}
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

export default RelatedDisplays;
