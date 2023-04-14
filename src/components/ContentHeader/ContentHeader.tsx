import React, { useEffect, useState, useMemo } from 'react';
import type { SyntheticEvent } from 'react';
import classNames from 'classnames';
import { Button, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { sidebarActiveSelector } from '../../selectors/ui';
import { setSidebarActive } from '../../slices/uiSlice';
import { useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import Pagination from '../Pagination';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import VariableSelector from '../VariableSelector/VariableSelector';
import {
  useDisplayInfo,
  useDisplayMetas,
  useDisplayMetasWithInputs,
  useMetaGroups,
  useMetaGroupsWithInputs,
} from '../../slices/displayInfoAPI';
import { setLabels } from '../../slices/labelsSlice';
import { labelsSelector } from '../../selectors';
import { selectSort, setSort } from '../../slices/sortSlice';
import styles from './ContentHeader.module.scss';
import FooterChip from '../FooterChip';

const ContentHeader: React.FC = () => {
  const selectedDisplay = useSelectedDisplay();
  const { data: displayInfo } = useDisplayInfo();
  const dispatch = useDispatch();
  const metaGroupsWithInputs = useMetaGroupsWithInputs();
  const metasWithInputs = useDisplayMetasWithInputs();
  const displayMetas = useDisplayMetas();
  const sortableMetas = displayMetas.filter((meta) => meta.sortable).map((meta) => meta);
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
  const unSortableMetas = displayMetas.filter((meta) => !meta.sortable).map((meta) => meta.varname);
  const metaGroups = useMetaGroups(unSortableMetas);
  const sort = useSelector(selectSort);
  const sort2 = Object.assign([], sort) as ISortState[];

  const [selectedLabelVariables, setSelectedLabelVariables] = useState(labelFormatted || []);
  const [selectedSortVariables, setSelectedSortVariables] = useState(sort || []);
  const [variableLabelSelectorIsOpen, setVariableLabelSelectorIsOpen] = useState(false);
  const [variableSortSelectorIsOpen, setVariableSortSelectorIsOpen] = useState(false);
  const [anchorLabelEl, setAnchorLabelEl] = useState<null | HTMLElement>(null);
  const [anchorSortEl, setAnchorSortEl] = useState<null | HTMLElement>(null);

  const sortRes = [];
  for (let i = 0; i < sort.length; i += 1) {
    const { varname } = sort[i];
    const { type } = displayInfo?.metas.find((m) => m.varname === varname) || {};
    let icon = 'icon-sort-alpha';
    if (type === 'number' || type === 'factor') {
      icon = 'icon-sort-numeric';
    }
    icon = `${icon}-${sort[i].dir}`;
    sortRes.push({ varname, icon });
  }

  useEffect(() => {
    setSelectedLabelVariables(labelFormatted);
  }, [labelFormatted]);

  useEffect(() => {
    setSelectedSortVariables(sort);
  }, [sort]);

  const handleVariableLabelSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorLabelEl(anchorLabelEl ? null : event.currentTarget);
    setVariableLabelSelectorIsOpen(!variableLabelSelectorIsOpen);
  };

  const handleLabelChange = (e: SyntheticEvent, value: ILabelState[]) => {
    setSelectedLabelVariables(value);
    dispatch(setLabels(value.map((label: ILabelState) => label.varname)));
  };

  const handleVariableSortSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorSortEl(anchorSortEl ? null : event.currentTarget);
    setVariableSortSelectorIsOpen(!variableSortSelectorIsOpen);
  };

  const handleStateClose = (x: { type: string; index: number; label: string }) => {
    if (x.type === 'sort') {
      dispatch(setSort(x.index));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
    }
  };

  const handleSortChange = (e: SyntheticEvent, value: ISortState[]) => {
    // get the last item of the array
    const addedItem = value[value.length - 1];
    if (value.length < selectedSortVariables.length) {
      dispatch(setSort(value));
      dispatch(
        setLayout({
          page: 1,
          type: 'layout',
        }),
      );
      return;
    }
    const metaType = displayMetas.find((meta) => meta.varname === addedItem.varname)?.type;
    sort2.push({ varname: addedItem.varname, dir: 'asc', type: 'sort', metatype: metaType || 'string' });
    setSelectedSortVariables(sort2);
    dispatch(setSort(sort2));
    dispatch(
      setLayout({
        page: 1,
        type: 'layout',
      }),
    );
  };

  const handleSortClick = (i: number) => {
    const sortObj = { ...sort2[i] };
    sortObj.dir = sortObj.dir === 'asc' ? 'desc' : 'asc';
    const newSort = [...sort2];
    newSort[i] = sortObj;
    dispatch(setSort(newSort));
  };

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
          <div className={styles.contentHeaderControlsItem}>
            <div>Sort</div>
            {sortRes.map((el: { varname: string; icon: string }, i: number) => (
              <FooterChip
                key={`${el.varname}_sortchip`}
                label={el.varname}
                icon={el.icon}
                text=""
                index={i}
                type="sort"
                handleClose={handleStateClose}
                handleClick={() => handleSortClick(i)}
              />
            ))}
            <IconButton onClick={handleVariableSortSelectorClick} aria-label="add-icon">
              <FontAwesomeIcon icon={faPlusCircle} fontSize="sm" />
            </IconButton>
            <VariableSelector
              isOpen={variableSortSelectorIsOpen}
              selectedVariables={selectedSortVariables as unknown as { [key: string]: string }[]}
              metaGroups={metaGroups}
              anchorEl={anchorSortEl}
              displayMetas={sortableMetas as unknown as { [key: string]: string }[]}
              handleChange={
                handleSortChange as unknown as (
                  event: React.SyntheticEvent<Element, Event>,
                  value: { [key: string]: string }[],
                ) => void
              }
            />
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
