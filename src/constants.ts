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
