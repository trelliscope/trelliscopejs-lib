import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener, IconButton } from '@mui/material';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useDisplayInfo, useDisplayMetas, useMetaGroups } from '../../slices/displayInfoAPI';
import { setLayout } from '../../slices/layoutSlice';
import { selectSort, setSort, setReOrderSorts } from '../../slices/sortSlice';
import Chip from '../Chip';
import VariableSelector from '../VariableSelector';
import styles from './Sort.module.scss';
import { META_TYPE_NUMBER, META_TYPE_FACTOR, META_TYPE_DATE, META_TYPE_DATETIME, META_TYPE_CURRENCY } from '../../constants';

const Sort: React.FC = () => {
  const { data: displayInfo } = useDisplayInfo();
  const dispatch = useDispatch();
  const displayMetas = useDisplayMetas();
  const sortableMetas = displayMetas.filter((meta) => meta.sortable).map((meta) => meta);
  const unSortableMetas = displayMetas.filter((meta) => !meta.sortable).map((meta) => meta.varname);
  const metaGroups = useMetaGroups(unSortableMetas);
  const sort = useSelector(selectSort);
  const sort2 = Object.assign([], sort) as ISortState[];
  const [selectedSortVariables, setSelectedSortVariables] = useState(sort || []);
  const [variableSortSelectorIsOpen, setVariableSortSelectorIsOpen] = useState(false);
  const [anchorSortEl, setAnchorSortEl] = useState<null | HTMLElement>(null);

  const sortRes: { varname: string; icon: string }[] = [];
  for (let i = 0; i < sort.length; i += 1) {
    const { varname } = sort[i];
    const { type } = displayInfo?.metas.find((m) => m.varname === varname) || {};
    let icon = 'icon-sort-alpha';
    if (
      type === META_TYPE_NUMBER ||
      type === META_TYPE_FACTOR ||
      type === META_TYPE_DATE ||
      type === META_TYPE_DATETIME ||
      type === META_TYPE_CURRENCY
    ) {
      icon = 'icon-sort-numeric';
    }
    icon = `${icon}-${sort[i].dir}`;
    sortRes.push({ varname, icon });
  }

  const orderedItemsRef = useRef(sortRes);

  useEffect(() => {
    if (sortRes !== orderedItemsRef.current) {
      orderedItemsRef.current = sortRes;
    }
  }, [sortRes]);

  useEffect(() => {
    setSelectedSortVariables(sort);
  }, [sort]);

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
    orderedItemsRef.current = [...orderedItemsRef.current, { varname: addedItem.varname, icon: 'icon-sort-alpha-asc' }];
  };

  const handleSortClick = (i: number) => {
    const sortObj = { ...sort2[i] };
    sortObj.dir = sortObj.dir === 'asc' ? 'desc' : 'asc';
    const newSort = [...sort2];
    newSort[i] = sortObj;
    dispatch(setSort(newSort));
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const updatedItems = arrayMove(
      orderedItemsRef.current,
      orderedItemsRef.current.findIndex((item) => `${item.varname}_chip` === `${active.id}`),
      orderedItemsRef.current.findIndex((item) => `${item.varname}_chip` === `${over.id}`),
    );
    orderedItemsRef.current = updatedItems;
    const newSort = orderedItemsRef.current.map((item) => sort.find((el) => el.varname === item.varname));
    dispatch(setReOrderSorts(newSort as ISortState[]));
  };

  return (
    <>
      <ClickAwayListener
        mouseEvent="onMouseUp"
        onClickAway={() => {
          setVariableSortSelectorIsOpen(false);
          setAnchorSortEl(null);
        }}
      >
        <div className={styles.sortContainer}>
          <div>
            <span className={styles.sortText}>Sort</span>
          </div>
          <div className={styles.sortDragContainer}>
            <DndContext modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <SortableContext
                items={sortRes.map((el: { varname: string; icon: string }) => ({ id: `${el.varname}_chip` }))}
              >
                {sortRes.map((el: { varname: string; icon: string }, i: number) => (
                  <Chip
                    key={`${el.varname}_sortchip`}
                    label={el.varname}
                    icon={el.icon}
                    text=""
                    index={i}
                    type="sort"
                    handleClose={handleStateClose}
                    handleClick={() => handleSortClick(i)}
                    enforceMaxWidth={false}
                    isDraggable
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
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
            hasTags
            disablePortal={false}
          />
        </div>
      </ClickAwayListener>
    </>
  );
};

export default Sort;
