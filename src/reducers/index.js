import { combineReducers } from 'redux';
import sidebar from './sidebar';
import ui from './ui';
import dialog from './dialog';
import appId from './appId';
import selectedDisplay from './selectedDisplay';
import panelRenderer from './panelRenderer';
import { layout, labels, sort, filter } from './displayState';
import _config from './_config';
import _displayList from './_displayList';
import _displayInfo from './_displayInfo';
import _cogDataMutable from './_cogDataMutable';

const app = combineReducers({
  appId,
  dialog,
  ui,
  sidebar,
  selectedDisplay,
  panelRenderer,
  layout,
  labels,
  sort,
  filter,
  _config,
  _displayList,
  _displayInfo,
  _cogDataMutable
});

export default app;
