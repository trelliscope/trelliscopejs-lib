import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import styles from './Ellipsis.module.scss';

interface EllipsisProps {
  options: { payload: string; text: string }[];
  curItem: string;
  setCurItem: Dispatch<SetStateAction<'ct,asc' | 'ct,desc' | 'id,asc' | 'id,desc'>>;
}

const Ellipsis: React.FC<EllipsisProps> = ({ options, curItem, setCurItem }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSortChange = (sortOrder: string) => {
    setCurItem(sortOrder as IMeta['filterSortOrder']);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuIconClick = (event: { currentTarget: SetStateAction<null> }) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(menuOpen ? null : event.currentTarget);
  };
  return (
    <div>
      {/* this is an issue with the iconButton in materialUi not having the type for an onClick in the props
          // @ts-ignore */}
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuIconClick}
        sx={{ width: 25, height: 25 }}
      >
        <FontAwesomeIcon icon={faEllipsisV} size="xs" />
      </IconButton>
      <Menu id="long-menu" open={menuOpen} anchorEl={anchorEl} onClose={handleMenuClose}>
        {options.map((d) => (
          <MenuItem
            key={d.payload}
            selected={d.payload === curItem}
            onClick={() => {
              handleSortChange(d.payload);
              handleMenuClose();
            }}
          >
            {d.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Ellipsis;
