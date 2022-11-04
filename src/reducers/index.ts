import { combineReducers } from 'redux';
import sidebar from '../slices/sidebarSlice';
import selectedDisplay from '../slices/selectedDisplaySlice';
import relDispPositions from '../slices/relDispPositionsSlice';
import selectedRelDisps from '../slices/selectedRelDispsSlice';
import displayList from '../slices/displayListSlice';
import ui from '../slices/uiSlice';
import layout from '../slices/layoutSlice';
import labels from '../slices/labelsSlice';
import sort from '../slices/sortSlice';
import { appId, dialog, singlePageApp, fullscreen, errorMsg, dispSelectDialog, dispInfoDialog, options } from './app';
import _config from '../slices/configSlice';
import filter from '../slices/filterSlice';
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
  displayList,
  _displayInfo,
  _cogDataMutable,
  _localPanels,
});

export default reducers;
