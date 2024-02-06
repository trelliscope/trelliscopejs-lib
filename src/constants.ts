export const SB_PANEL_LAYOUT = 'Panel Grid Layout' as string;
export const SB_PANEL_FILTER = 'Filter Panels' as string;
export const SB_PANEL_SORT = 'Sort Panels' as string;
export const SB_PANEL_LABELS = 'Show/Hide Labels' as string;
export const SB_VIEWS = 'Views' as string;
export const SB_CONFIG = 'Configuration' as string;

export const INPUT_TYPE_TEXT = 'text' as string;
export const INPUT_TYPE_NUMBER = 'number' as string;
export const INPUT_TYPE_RADIO = 'radio' as string;
export const INPUT_TYPE_CHECKBOX = 'checkbox' as string;
export const INPUT_TYPE_SELECT = 'select' as string;
export const INPUT_TYPE_MULTISELECT = 'multiselect' as string;

export const META_TYPE_STRING = 'string' as string;
export const META_TYPE_NUMBER = 'number' as string;
export const META_TYPE_FACTOR = 'factor' as string;
export const META_TYPE_DATE = 'date' as string;
export const META_TYPE_DATETIME = 'datetime' as string;
export const META_TYPE_HREF = 'href' as string;
export const META_TYPE_GEO = 'geo' as string;
export const META_TYPE_GRAPH = 'graph' as string;
export const META_TYPE_CURRENCY = 'currency' as string;
export const META_TYPE_PANEL = 'panel' as string;

export const FILTER_TYPE_CATEGORY = 'category' as string;
export const FILTER_TYPE_NUMBERRANGE = 'numberrange' as string;
export const FILTER_TYPE_DATERANGE = 'daterange' as string;
export const FILTER_TYPE_DATETIMERANGE = 'datetimerange' as string;

export const META_FILTER_TYPE_MAP = {
  [META_TYPE_STRING]: FILTER_TYPE_CATEGORY,
  [META_TYPE_NUMBER]: FILTER_TYPE_NUMBERRANGE,
  [META_TYPE_CURRENCY]: FILTER_TYPE_NUMBERRANGE,
  [META_TYPE_FACTOR]: FILTER_TYPE_CATEGORY,
  [META_TYPE_DATE]: FILTER_TYPE_DATERANGE,
  [META_TYPE_DATETIME]: FILTER_TYPE_DATETIMERANGE,
};

export const GRID_ARRANGEMENT_ROWS = 'rows' as string;
export const GRID_ARRANGEMENT_COLS = 'cols' as string;

export const PANEL_KEY = '__PANEL_KEY__' as string;

// Symbol to use as a key for common tags to avoid collisions with user-defined tags
export const COMMON_TAGS_KEY = Symbol('__common__') as symbol;

export const TYPE_MAP: { [key: string]: 'number' | 'string' | 'date' | 'datetime' } = {
  [META_TYPE_STRING]: 'string',
  [META_TYPE_NUMBER]: 'number',
  [META_TYPE_DATE]: 'date',
  [META_TYPE_DATETIME]: 'datetime',
  [META_TYPE_HREF]: 'string',
  [META_TYPE_GEO]: 'string',
  [META_TYPE_GRAPH]: 'number',
  [META_TYPE_CURRENCY]: 'number',
  [META_TYPE_FACTOR]: 'number',
};

export const MISSING_TEXT = '[missing]' as string;

export const META_DATA_STATUS = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
  IDLE: 'idle',
};

export const TOUR_STEPS = [
  {
    target: '#sort-add-icon',
    content:
      'You can add a sort here. Clicking the pill will change the sort order. Sorts can be dragged to re-order by using the drag handle. ',
    disableBeacon: true,
  },
  {
    target: '#column-control',
    content: 'You can adjust the amount of columns in the grid. If table view is active, you can hide columns or pin them.',
    disableBeacon: true,
  },
  {
    target: '#label-control',
    content: 'You can add labels here. The label will then appear on the panel.',
    disableBeacon: true,
  },
  {
    target: '#view-control',
    content:
      'Views are used to change the layout, filters, sorts and labels all at once. You are able to create new views which are saved locally.',
    disableBeacon: true,
  },
  {
    target: '#layout-control',
    content: 'You can change the layout to be a grid or a table. In table view, labels are present as columns.',
    disableBeacon: true,
  },
  {
    target: '#display-control',
    content: 'If there are multiple displays you can change displays here.',
    disableBeacon: true,
  },
  {
    target: '#share-control',
    content: 'You can get a shareable link to the current view here.',
    disableBeacon: true,
  },
  {
    target: '#export-control',
    content: 'You can get an exportable download here of the current inputs in csv format.',
    disableBeacon: true,
  },
  {
    target: '#help-control',
    content: 'You can see a general overview of the application here and how to use it.',
    disableBeacon: true,
  },
  {
    target: '#fullscreen-control',
    content: 'You can toggle fullscreen mode here.',
    disableBeacon: true,
  },
  {
    target: '#filter-drawer-button',
    content:
      'This will expand the filter drawer where you can add, remove, and edit filters. Filters are also draggable to re-order. You can also enable the label or sort right from the filter.',
    disableBeacon: true,
  },
  {
    target: '#panel-control',
    content:
      'If multiple images are present you can change the selected image in the top left of a panel. You can hover over the panel and in the top right you can expand the panel for a closer look.',
    disableBeacon: true,
  },
];
