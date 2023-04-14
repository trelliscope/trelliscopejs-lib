import React, { useEffect, useState, useMemo } from 'react';
import type { SyntheticEvent } from 'react';
import classNames from 'classnames';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { sidebarActiveSelector } from '../../selectors/ui';
import { setSidebarActive } from '../../slices/uiSlice';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import Pagination from '../Pagination';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import { selectLayout } from '../../slices/layoutSlice';
import VariableSelector from '../VariableSelector/VariableSelector';
import { useDisplayMetas, useDisplayMetasWithInputs, useMetaGroupsWithInputs } from '../../slices/displayInfoAPI';
import { setLabels } from '../../slices/labelsSlice';
import { labelsSelector } from '../../selectors';
import styles from './ContentHeader.module.scss';

const ContentHeader: React.FC = () => {
  const selectedDisplay = useSelectedDisplay();
  const dispatch = useDispatch();
  const metaGroupsWithInputs = useMetaGroupsWithInputs();
  const metasWithInputs = useDisplayMetasWithInputs();
  const layout = useSelector(selectLayout);
  const displayLoaded = selectedDisplay?.name !== '';
  const sidebarOpen = useSelector(sidebarActiveSelector);
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

  // TODO add sorting
  // TODO we need to filter out the metaGroups and data if its notsortable or non filterable that should happen in the parent component

  return (
    <div className={styles.contentHeader}>
      <div className={styles.contentHeaderControls}>
        <div className={styles.contentHeaderControlsLeft}>
          <div className={classNames(styles.contentHeaderControlsItem, styles.contentHeaderControlsItemToggle)}>
            <Button
              onClick={() => dispatch(setSidebarActive(!sidebarOpen))}
              variant={sidebarOpen ? 'contained' : 'text'}
              sx={{
                color: sidebarOpen ? '#fff' : '#000',
                textTransform: 'unset',
                fontSize: '15px',
                borderRadius: 0,
              }}
              startIcon={sidebarOpen ? <CloseIcon /> : <KeyboardArrowLeftIcon />}
            >
              Explore
            </Button>
          </div>
          {layout?.viewtype !== 'table' && (
            <>
              <div className={styles.contentHeaderControlsItem}>
                <ColumnSelector />
              </div>
              <div className={styles.contentHeaderControlsItem}>
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
                />
              </div>
            </>
          )}
        </div>
        <div className={styles.contentHeaderControlsPagination}>{displayLoaded && <Pagination />}</div>
      </div>
    </div>
  );
};

export default ContentHeader;
