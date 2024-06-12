import React from 'react';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Menu, MenuItem, Typography, Tooltip, Button, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './PanelPicker.module.scss';
import ErrorWrapper from '../ErrorWrapper';

interface PanelPickerProps {
  handlePanelChange: (value: string) => void;
  selectedValue: string;
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: null | HTMLElement) => void;
  isInHeader: boolean;
  panelMetas: IMeta[];
}

const PanelPicker: React.FC<PanelPickerProps> = ({
  handlePanelChange,
  selectedValue,
  anchorEl,
  setAnchorEl,
  isInHeader,
  panelMetas,
}) => {
  const open = Boolean(anchorEl);

  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (value: string) => {
    setAnchorEl(null);
    handlePanelChange(value);
  };

  return (
    <ErrorWrapper>
      <div className={styles.panelPicker}>
        <Box>
          {isInHeader ? (
            <Button
              sx={{
                color: theme.palette.primary.contrastText,
                textTransform: 'unset',
              }}
              onClick={handleClick}
              endIcon={<FontAwesomeIcon className={styles.displaySelectIcon} icon={open ? faChevronUp : faChevronDown} />}
            >
              View {panelMetas ? panelMetas?.length : 0} other panel{panelMetas && panelMetas.length === 1 ? '' : 's'}
            </Button>
          ) : (
            <Tooltip arrow title="Panel Selection">
              <IconButton sx={{ color: theme.palette.primary.contrastText }} size="small" onClick={handleClick}>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
              </IconButton>
            </Tooltip>
          )}
          <Menu
            id="panel-picker"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              sx: { backgroundColor: theme.palette.secondary.main },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', px: 2, py: 1 }}>
              Select a different panel
            </Typography>
            {panelMetas?.map((value) => (
              <MenuItem
                key={value.varname}
                onClick={() => handleMenuClick(value.varname)}
                selected={value.varname === selectedValue}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ alignSelf: 'start' }}>{value.varname}</div>
                  <Box
                    sx={{
                      fontSize: 13,
                      alignSelf: 'start',
                    }}
                  >
                    {value.label}
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </div>
    </ErrorWrapper>
  );
};

export default PanelPicker;
