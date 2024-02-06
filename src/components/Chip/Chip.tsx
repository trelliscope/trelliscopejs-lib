import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  faArrowDown91,
  faArrowDown19,
  faArrowDownZA,
  faArrowDownAZ,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons';
import { Box, useTheme } from '@mui/material';
import styles from './Chip.module.scss';
import { useConfig } from '../../slices/configAPI';

interface ChipProps {
  label: string;
  icon: string;
  text: string;
  index: number;
  type: string;
  handleClose: (x: { label: string; index: number; type: string }) => void;
  handleClick: () => void;
  enforceMaxWidth: boolean;
  isDraggable: boolean;
}

const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  text,
  index,
  type,
  handleClose,
  handleClick,
  enforceMaxWidth,
  isDraggable,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `${label}_chip` });
  const transformString = CSS.Transform.toString(transform) || '';
  const matchTranslate = transformString.match(/translate3d\((.*?), (.*?), (.*?)\)/);
  const { data: configObj } = useConfig();

  const theme = useTheme();

  const style = {
    transform: matchTranslate ? `${matchTranslate[0]} scaleX(1) scaleY(1)` : '',
    transition,
    zIndex: isDragging ? 1000 : undefined,
    background: theme.palette.primary.main,
    '&:hover': { background: theme.palette.primary.dark },
  };

  return (
    <Box
      className={classNames(styles.chipWrapper, { [styles.chipWrapperContained]: enforceMaxWidth })}
      ref={isDraggable ? setNodeRef : null}
      sx={
        isDraggable
          ? style
          : { background: theme.palette.primary.main, '&:hover': { background: theme.palette.primary.dark } }
      }
      {...attributes}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
          }
        }}
        className={styles.chipLabel}
        style={{
          color: configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText || '#fff',
        }}
      >
        {icon.includes('alpha-asc') && (
          <FontAwesomeIcon
            color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
            icon={faArrowDownAZ}
          />
        )}
        {icon.includes('alpha-desc') && (
          <FontAwesomeIcon
            color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
            icon={faArrowDownZA}
          />
        )}
        {(icon.includes('numeric-asc') || icon.includes('amount-asc')) && (
          <FontAwesomeIcon
            color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
            icon={faArrowDown19}
          />
        )}
        {(icon.includes('numeric-desc') || icon.includes('amount-desc')) && (
          <FontAwesomeIcon
            color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
            icon={faArrowDown91}
          />
        )}
        {label}
        {text !== '' && <span className={styles.chipText}>{`(${text})`}</span>}
      </span>
      {isDraggable && (
        <span className={styles.chipDragIcon}>
          <FontAwesomeIcon
            color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText || '#fff'}
            {...listeners}
            icon={faGripVertical}
          />
        </span>
      )}
      <svg
        viewBox="0 0 24 24"
        className={styles.chipCloseIcon}
        key="icon"
        onClick={() => handleClose({ label, index, type })}
      >
        <path
          d={
            'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 ' +
            '13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 ' +
            '10.59 15.59 7 17 8.41 13.41 12 17 15.59z'
          }
        />
      </svg>
    </Box>
  );
};

export default Chip;
