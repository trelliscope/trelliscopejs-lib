import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorWrapper from '../ErrorWrapper';
import { TOUR_STEPS } from '../../constants';
import styles from './Tour.module.scss';
import { selectLayout } from '../../slices/layoutSlice';

const Tour: React.FC = () => {
  const [tourIndex, setTourIndex] = useState(0);
  const [tourSteps, setTourSteps] = useState(TOUR_STEPS);
  const [tourIsOpen, setTourIsOpen] = useState(false);
  const layout = useSelector(selectLayout);
  const theme = useTheme();

  const handleCallBack = (event: {
    status: string;
    action: string;
    index: number;
    type: 'step:after' | 'error:target_not_found';
  }) => {
    if (event?.status === 'skipped' || event?.status === 'finished' || event?.action === 'close') {
      setTourIndex(event.index);
      setTourIsOpen(false);
      if (event?.status === 'finished') {
        setTourIndex(0);
      }
      return;
    }
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(event?.type)) {
      // Update state to advance the tour
      setTourIndex(tourIndex + (event?.action === ACTIONS.PREV ? -1 : 1));
    }
  };

  useEffect(() => {
    setTourIndex(0);
    if (layout?.viewtype === 'table') {
      const newTourSteps = TOUR_STEPS.filter((step) => step.target !== '#panel-control' && step.target !== '#label-control');
      setTourSteps(newTourSteps);
      return;
    }
    setTourSteps(TOUR_STEPS);
  }, [layout?.viewtype]);

  return (
    <ErrorWrapper>
      <div className={styles.tour}>
        <Joyride
          run={tourIsOpen}
          steps={tourSteps}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          callback={handleCallBack}
          stepIndex={tourIndex}
          continuous
          showSkipButton
          disableScrollParentFix
          locale={{
            last: 'End Tour',
          }}
          styles={{
            options: {
              primaryColor: theme.palette.primary.main,
              backgroundColor: theme.palette.secondary.main,
              zIndex: 9000,
              textColor: theme.palette.primary.contrastText,
            },
          }}
        />
        <Tooltip title="Launch Help Tour">
          <IconButton
            sx={{ color: theme.palette.primary.contrastText }}
            data-testid="tour-button"
            onClick={() => setTourIsOpen(true)}
          >
            <FontAwesomeIcon icon={faHand} />
          </IconButton>
        </Tooltip>
      </div>
    </ErrorWrapper>
  );
};

export default Tour;
