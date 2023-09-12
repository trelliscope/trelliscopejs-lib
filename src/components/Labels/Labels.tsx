import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { faChevronUp, faChevronDown, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ClickAwayListener, IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { labelsSelector } from '../../selectors';
import { useMetaGroupsWithInputs, useDisplayMetasWithInputs } from '../../slices/displayInfoAPI';
import { setLabels } from '../../slices/labelsSlice';
import VariableSelector from '../VariableSelector';
import styles from './Labels.module.scss';
import { selectLayout, setLayout } from '../../slices/layoutSlice';

const Labels: React.FC = () => {
  const dispatch = useDispatch();
  const metaGroupsWithInputs = useMetaGroupsWithInputs();
  const metasWithInputs = useDisplayMetasWithInputs();
  const labels = useSelector(labelsSelector);
  const labelFormatted = useMemo(
    () =>
      labels.map((label) => {
        const labelObj = {
          varname: label,
        };
        return labelObj;
      }),
    [labels],
  );
  const [selectedLabelVariables, setSelectedLabelVariables] = useState(labelFormatted || []);
  const [variableLabelSelectorIsOpen, setVariableLabelSelectorIsOpen] = useState(false);
  const [anchorLabelEl, setAnchorLabelEl] = useState<null | HTMLElement>(null);
  const layout = useSelector(selectLayout);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    setShowLabels(layout?.showLabels);
  }, [layout?.showLabels]);

  useEffect(() => {
    setSelectedLabelVariables(labelFormatted);
  }, [labelFormatted]);

  const handleVariableLabelSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorLabelEl(anchorLabelEl ? null : event.currentTarget);
    setVariableLabelSelectorIsOpen(!variableLabelSelectorIsOpen);
  };

  const handleLabelChange = (e: SyntheticEvent, value: ILabelState[]) => {
    setSelectedLabelVariables(value);
    dispatch(setLabels(value.map((label: ILabelState) => label.varname)));
  };

  const handleShowLabels = () => {
    setShowLabels(!showLabels);
    dispatch(setLayout({ showLabels: !layout?.showLabels }));
  };

  return (
    <>
      <ClickAwayListener
        mouseEvent="onMouseUp"
        onClickAway={() => {
          setVariableLabelSelectorIsOpen(false);
          setAnchorLabelEl(null);
        }}
      >
        <div className={styles.labelsContainer}>
          <Tooltip arrow title={`${showLabels ? 'Hide' : 'Show'} labels under panels`}>
            <IconButton onClick={handleShowLabels}>
              <FontAwesomeIcon icon={showLabels ? faEye : faEyeSlash} />
            </IconButton>
          </Tooltip>
          <Button
            sx={{
              color: '#000000',
              textTransform: 'unset',
              fontSize: '15px',
            }}
            type="button"
            onClick={handleVariableLabelSelectorClick}
            endIcon={<FontAwesomeIcon icon={variableLabelSelectorIsOpen ? faChevronUp : faChevronDown} />}
          >
            Labels
          </Button>
          <VariableSelector
            isOpen={variableLabelSelectorIsOpen}
            selectedVariables={selectedLabelVariables}
            metaGroups={metaGroupsWithInputs}
            anchorEl={anchorLabelEl}
            displayMetas={metasWithInputs as unknown as { [key: string]: string }[]}
            handleChange={
              handleLabelChange as unknown as (
                event: React.SyntheticEvent<Element, Event>,
                value: { [key: string]: string }[],
              ) => void
            }
            hasTags
            disablePortal={false}
          />
        </div>
      </ClickAwayListener>
    </>
  );
};

export default Labels;
