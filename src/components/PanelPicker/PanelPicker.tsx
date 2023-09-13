import React from 'react';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { META_TYPE_PANEL } from '../../constants';
import styles from './PanelPicker.module.scss';

interface PanelPickerProps {
  handlePanelChange: (value: string) => void;
  selectedValue: string;
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: null | HTMLElement) => void;
}

const PanelPicker: React.FC<PanelPickerProps> = ({ handlePanelChange, selectedValue, anchorEl, setAnchorEl }) => {
  const { data } = useDisplayInfo();
  const panelMetas = data?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL);
  const open = Boolean(anchorEl);
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
    <div className={styles.panelPicker}>
      <Box>
        <IconButton
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.5);',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.7);',
            },
          }}
          size="small"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
        </IconButton>
        <Menu id="panel-picker" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{}}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', px: 2, py: 1 }}>
            Panel Selection:
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
                <div style={{ fontSize: 13, color: '#555555', alignSelf: 'start' }}>{value.label}</div>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </div>
  );
};

export default PanelPicker;
