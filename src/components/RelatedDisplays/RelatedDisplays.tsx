import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import DisplayList from '../DisplayList';
import getCustomProperties from '../../getCustomProperties';
import { useDisplayList } from '../../slices/displayListAPI';
import { selectSelectedRelDisps } from '../../slices/selectedRelDispsSlice';
import styles from './RelatedDisplays.module.scss';

interface RelatedDisplaysProps {
  setDialogOpen: (isOpen: boolean) => void;
  relatedDisplayGroups: IDisplayListItem[];
  selectedDisplay: IDisplayListItem;
}

const RelatedDisplays: React.FC<RelatedDisplaysProps> = ({ setDialogOpen, relatedDisplayGroups, selectedDisplay }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [headerHeight] = getCustomProperties(['--header-height']) as number[];
  const { data: displayList } = useDisplayList();
  const selectedRelDisps = useSelector(selectSelectedRelDisps);

  const propStyles = {
    button: {
      left: headerHeight * (selectedDisplay?.name === '' || relatedDisplayGroups.length === 0 ? 0 : 2) - 1,
      background: selectedRelDisps.length === 0 ? 'none' : 'rgba(69, 138, 249, 0.4)',
      color: selectedRelDisps.length === 0 ? '#9ba3af' : 'white',
    },
  };
  const active = Object.keys(relatedDisplayGroups).length > 0;

  const handleOpen = () => {
    setDialogOpen(true);
    setOpen(true);
  };

  const handleKey = () => {
    setDialogOpen(true);
    setOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setOpen(false);
  };

  useHotkeys('r', handleKey, { enabled: active && !open });
  useHotkeys('r', handleClose, { enabled: active && open });
  useHotkeys('esc', handleClose, { enabled: open });

  const setStep = (step: number) => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (selectedRelDisps.length === 0) {
      setStep(0);
    }
  }, [selectedRelDisps]);

  const stepContent = [
    <DisplayList
      displayItems={displayList as IDisplayListItem[]}
      handleClick={() => {}}
      selectable
      excludedDisplays={[selectedDisplay?.name]}
    />,
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
            {/* <Stepper className={styles.relatedDisplaysStepper} alternativeLabel nonLinear activeStep={activeStep}>
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
            </Stepper> */}
            <div className={styles.relatedDisplaysDialogTitle}>
              Select related displays ({selectedRelDisps.length} selected)
            </div>
            <div>{stepContent[activeStep]}</div>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <div className={styles.relatedDisplaysDialogActionText}>
            <Button
              onClick={() => setStep(activeStep === 1 ? 0 : 1)}
              className={styles.relatedDisplaysButtonDialog}
              disabled={activeStep === 0 && selectedRelDisps.length === 0}
            >
              {activeStep === 0 ? '' : <FontAwesomeIcon icon={faChevronLeft} />}
              {activeStep === 0 ? 'Set Layout' : 'Select Displays'}
              {activeStep === 0 ? <FontAwesomeIcon icon={faChevronRight} /> : ''}
            </Button>
          </div> */}
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RelatedDisplays;
