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
import app from '../slices/appSlice';
import _config from '../slices/configSlice';
import filter from '../slices/filterSlice';
import displayInfo from '../slices/displayInfoSlice';
import cogDataMutable from '../slices/cogDataMutableSlice';

const reducers = combineReducers({
  app,
  ui,
  sidebar,
  selectedDisplay,
  selectedRelDisps,
  relDispPositions,
  layout,
  labels,
  sort,
  filter,
  _config,
  displayList,
  displayInfo,
  cogDataMutable,
});

export default reducers;
