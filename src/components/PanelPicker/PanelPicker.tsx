import React, { useState } from 'react';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { META_TYPE_PANEL } from '../../constants';
import styles from './PanelPicker.module.scss';

interface PanelPickerProps {
  handlePanelChange: (value: string) => void;
  selectedValue: string;
}

const PanelPicker: React.FC<PanelPickerProps> = ({ handlePanelChange, selectedValue }) => {
  const { data } = useDisplayInfo();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const panelMetas = data?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL).map((meta) => meta.varname);
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
          {panelMetas?.map((value) => (
            <MenuItem key={value} onClick={() => handleMenuClick(value)} selected={value === selectedValue}>
              {value}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </div>
  );
};

export default PanelPicker;
