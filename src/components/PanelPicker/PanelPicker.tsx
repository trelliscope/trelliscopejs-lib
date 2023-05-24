import React, { useState } from 'react';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { META_TYPE_PANEL } from '../../constants';
import styles from './PanelPicker.module.scss';

interface PanelPickerProps {
  handlePanelChange: (value: string) => void;
  selectedValue: string;
}

const PanelPicker: React.FC<PanelPickerProps> = ({ handlePanelChange, selectedValue }) => {
  //  position in the top left
  //  add drop down arrow toggle menu similar to views
  // TODO populate view with panel images available and label
  // TODO onclick needs to take a panel and bubble it back up to parent
  const dispatch = useDispatch();
  const { data } = useDisplayInfo();
  const views = data?.views as IView[];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const panelMetas = data?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL).map((meta) => meta.varname);
  console.log('panelMetas:::', panelMetas);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('clicked');
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
        <IconButton size="small" onClick={handleClick}>
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
