import { combineReducers } from 'redux';
import sidebar from '../slices/sidebarSlice';
import selectedDisplay from '../slices/selectedDisplaySlice';
import relDispPositions from '../slices/relDispPositionsSlice';
import selectedRelDisps from '../slices/selectedRelDispsSlice';
import ui from '../slices/uiSlice';
import { appId, dialog, singlePageApp, fullscreen, errorMsg, dispSelectDialog, dispInfoDialog, options } from './app';
import { layout, labels, sort, filter } from './displayState';
import _config from '../slices/configSlice';
import _displayList from './_displayList';
import _displayInfo from './_displayInfo';
import _cogDataMutable from './_cogDataMutable';
import _localPanels from './_localPanels';

const reducers = combineReducers({
  appId,
  dialog,
  options,
  dispSelectDialog,
  dispInfoDialog,
  singlePageApp,
  fullscreen,
  ui,
  sidebar,
  errorMsg,
  selectedDisplay,
  selectedRelDisps,
  relDispPositions,
  layout,
  labels,
  sort,
  filter,
  _config,
  _displayList,
  _displayInfo,
  _cogDataMutable,
  _localPanels,
});

export default reducers;
