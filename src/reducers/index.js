import { combineReducers } from 'redux';
import sidebar from './sidebar';
import ui from './ui';
import {
  appId, dialog, singlePageApp, fullscreen, errorMsg,
  dispSelectDialog
} from './app';
import selectedDisplay from './selectedDisplay';
import panelRenderer from './panelRenderer';
import {
  layout, labels, sort, filter
} from './displayState';
import _config from './_config';
import _displayList from './_displayList';
import _displayInfo from './_displayInfo';
import _cogDataMutable from './_cogDataMutable';
import _localPanels from './_localPanels';

const reducers = combineReducers({
  appId,
  dialog,
  dispSelectDialog,
  singlePageApp,
  fullscreen,
  ui,
  sidebar,
  errorMsg,
  selectedDisplay,
  panelRenderer,
  layout,
  labels,
  sort,
  filter,
  _config,
  _displayList,
  _displayInfo,
  _cogDataMutable,
  _localPanels
});

export default reducers;
