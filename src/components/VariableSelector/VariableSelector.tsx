/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Popper,
  Select,
  TextField,
  Checkbox,
  createFilterOptions,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import styles from './VariableSelector.module.scss';
import { useConfig } from '../../slices/configAPI';

interface VariableSelectorProps {
  isOpen: boolean;
  selectedVariables: { [key: string]: string }[];
  metaGroups: Map<string | symbol, string[]> | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setVariableSelectorIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  displayMetas: { [key: string]: string }[];
  handleChange: (event: React.SyntheticEvent<Element, Event>, value: { [key: string]: string }[]) => void;
  hasTags: boolean;
  disablePortal: boolean;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  isOpen,
  selectedVariables,
  metaGroups,
  anchorEl,
  setAnchorEl,
  setVariableSelectorIsOpen,
  displayMetas,
  handleChange,
  hasTags,
  disablePortal,
}) => {
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: { [key: string]: string }) => option.label + option.varname,
  });

  const [tagGroup, setTagGroup] = useState('__ALL__');

  const { data: configObj } = useConfig();

  const handleTagChange = (event: SelectChangeEvent<string>) => {
    setTagGroup(event.target.value);
  };

  // this will close the variable selector if the user clicks outside of it and into an iframe
  useEffect(() => {
    const handleBlur = () => {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      if (iframes.includes(document.activeElement as HTMLIFrameElement) && setVariableSelectorIsOpen) {
        setVariableSelectorIsOpen(false);
        setAnchorEl(null);
      }
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div className={styles.variableSelector}>
      <Popper
        data-testid="variable-picker"
        open={isOpen || false}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        disablePortal={disablePortal}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={0}>
            <div style={{ width: 350, background: '#FFFFFF', borderRadius: '4px' }}>
              <Box sx={{ p: 1, display: 'flex', flexDirection: 'row' }}>
                <Autocomplete
                  classes={{ popupIndicatorOpen: styles.variableSelectorPopupIndicatorOpen }}
                  multiple
                  open
                  limitTags={0}
                  id="variable-select"
                  options={displayMetas}
                  filterOptions={filterOptions}
                  disableCloseOnSelect
                  PopperComponent={(props) => <Popper sx={{ zIndex: 2001 }} {...props} disablePortal={disablePortal} />}
                  PaperComponent={(props) =>
                    hasTags && metaGroups ? (
                      <Paper {...props}>
                        <Box
                          sx={{
                            minWidth: 150,
                            pl: 2,
                            pr: 2,
                            pt: 2,
                            pb: 1,
                            backgroundColor: (theme) => theme.palette.primary.main,
                            zIndex: 2001,
                          }}
                        >
                          <FormControl variant="standard" size="small" fullWidth>
                            <InputLabel
                              sx={{
                                color: configObj?.theme?.isLightTextOnDark
                                  ? configObj?.theme?.lightText
                                  : configObj?.theme?.darkText || '#FFFFFF',
                              }}
                              id="demo-simple-select-label"
                            >
                              Variable Type
                            </InputLabel>
                            <Select
                              sx={{
                                color: configObj?.theme?.isLightTextOnDark
                                  ? configObj?.theme?.lightText
                                  : configObj?.theme?.darkText || '#FFFFFF',
                              }}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={tagGroup}
                              label="Variable Type"
                              onChange={handleTagChange}
                            >
                              <MenuItem value="__ALL__">All</MenuItem>
                              {Array.from(metaGroups.keys())
                                .filter((d) => typeof d === 'string')
                                .map((d) => (
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore this is a material and type issue
                                  <MenuItem key={d} value={d}>
                                    {d}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        {props.children}
                      </Paper>
                    ) : (
                      <Paper {...props}>{props.children}</Paper>
                    )
                  }
                  isOptionEqualToValue={(option, value) => option.varname === value.varname}
                  getOptionLabel={(option) => option.varname}
                  renderOption={(props, option, { selected }) => {
                    const hasLabel = option.label && option.label !== option.varname;
                    const showOption = tagGroup === '__ALL__' || option?.tags?.includes(tagGroup);
                    const optionVal = displayMetas.filter((d: { [key: string]: string }) => d.varname === option.varname)[0];
                    return (
                      <li {...props} style={{ display: showOption ? 'inherit' : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox disableTouchRipple style={{ marginRight: 8 }} checked={selected} />
                          </Box>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ lineHeight: hasLabel ? '20px' : '36px' }}>{optionVal?.varname}</div>
                            {hasLabel && <div style={{ fontSize: 13, color: '#555555' }}>{optionVal?.label}</div>}
                          </div>
                        </div>
                      </li>
                    );
                  }}
                  value={selectedVariables}
                  onChange={handleChange}
                  getLimitTagsText={(more) => <span style={{ marginLeft: 5, color: '#888888' }}>{`${more} selected`}</span>}
                  renderInput={(params) => (
                    <TextField autoFocus {...params} label="Search or select a variable" placeholder="" />
                  )}
                  fullWidth
                />
              </Box>
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default VariableSelector;
