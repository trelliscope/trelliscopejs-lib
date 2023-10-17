import React from 'react';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Menu, MenuItem, Typography, Tooltip, Button } from '@mui/material';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { META_TYPE_PANEL } from '../../constants';
import styles from './PanelPicker.module.scss';
import { useConfig } from '../../slices/configAPI';

interface PanelPickerProps {
  handlePanelChange: (value: string) => void;
  selectedValue: string;
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: null | HTMLElement) => void;
  useCustomStyles: boolean;
}

const PanelPicker: React.FC<PanelPickerProps> = ({
  handlePanelChange,
  selectedValue,
  anchorEl,
  setAnchorEl,
  useCustomStyles,
}) => {
  const { data } = useDisplayInfo();
  const panelMetas = data?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL);
  const open = Boolean(anchorEl);
  const { data: configObj } = useConfig();

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
        <Tooltip arrow title="Panel Selection">
          <Button
            sx={{
              backgroundColor: useCustomStyles ? 'transparent' : 'rgba(255, 255, 255, 0.5);',
              color:
                useCustomStyles && configObj?.theme?.header
                  ? configObj?.theme?.header?.text
                  : useCustomStyles && configObj?.theme && configObj?.theme?.isLightTextOnDark
                  ? configObj?.theme?.lightText
                  : useCustomStyles && configObj?.theme && !configObj?.theme?.isLightTextOnDark
                  ? configObj?.theme?.darkText
                  : '#757575',
              '&:hover': {
                backgroundColor: useCustomStyles ? 'transparent' : 'rgba(255, 255, 255, 0.7);',
              },
              textTransform: 'unset',
            }}
            onClick={handleClick}
            endIcon={<FontAwesomeIcon className={styles.displaySelectIcon} icon={open ? faChevronUp : faChevronDown} />}
          >
            View {panelMetas ? panelMetas?.length - 1 : 0} other panel{panelMetas && panelMetas.length === 2 ? '' : 's'}
          </Button>
        </Tooltip>
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
