import React from 'react';
import { Drawer } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import Filters from '../Filters';
import { filterViewSelector } from '../../selectors';
import FilterInput from '../FilterInput';
import styles from './Sidebar.module.scss';
import { setFilterView } from '../../slices/filterSlice';
import { selectLayout } from '../../slices/layoutSlice';

const drawerWidth = 400;

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(selectLayout);
  const { active: activeFilters, inactive: inactiveFilters } = useSelector(filterViewSelector);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id !== over.id) {
      const oldIndex = activeFilters.findIndex((filter) => `${filter}_filter` === active.id);
      const newIndex = activeFilters.findIndex((filter) => `${filter}_filter` === over.id);
      const newFilters = arrayMove(activeFilters, oldIndex, newIndex);
      dispatch(setFilterView({ name: { active: newFilters, inactive: inactiveFilters }, which: 'set' }));
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: 'inherit',
        '& .MuiDrawer-paper': {
          paddingTop: '54px',
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          height: 'inherit',
        },
      }}
      open={layout.sidebarActive}
      className={styles.sidebar}
      variant="persistent"
      anchor="left"
    >
      <Filters />
      {activeFilters.length === 0 && (
        <div className={styles.sidebarNoFilter}>
          Select a filter...
          <FontAwesomeIcon className={styles.sidebarBobbingArrow} icon={faArrowUp} />
        </div>
      )}
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={activeFilters.map((el: string) => ({ id: `${el}_filter` }))}>
          <div className={styles.sidebarDragContainer}>
            <div className={styles.sidebarDragSubContainer}>
              {activeFilters.map((filter) => (
                <FilterInput key={filter} filterName={filter} />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </Drawer>
  );
};

export default Sidebar;
