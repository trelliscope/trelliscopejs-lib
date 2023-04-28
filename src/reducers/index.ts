import { combineReducers } from 'redux';
import sidebar from '../slices/sidebarSlice';
import selectedDisplay from '../slices/selectedDisplaySlice';
import relDispPositions from '../slices/relDispPositionsSlice';
import selectedRelDisps from '../slices/selectedRelDispsSlice';
import ui from '../slices/uiSlice';
import layout from '../slices/layoutSlice';
import labels from '../slices/labelsSlice';
import sort from '../slices/sortSlice';
import app from '../slices/appSlice';
import _config from '../slices/configSlice';
import filter from '../slices/filterSlice';
import cogDataMutable from '../slices/cogDataMutableSlice';
import { configAPI } from '../slices/configAPI';
import { displayListAPI } from '../slices/displayListAPI';
import { metaDataAPI } from '../slices/metaDataAPI';
import { displayInfoAPI } from '../slices/displayInfoAPI';
import { htmlAPI } from '../slices/htmlAPI';

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
  cogDataMutable,
  [configAPI.reducerPath]: configAPI.reducer,
  [displayListAPI.reducerPath]: displayListAPI.reducer,
  [metaDataAPI.reducerPath]: metaDataAPI.reducer,
  [displayInfoAPI.reducerPath]: displayInfoAPI.reducer,
  [htmlAPI.reducerPath]: htmlAPI.reducer,
});

export default reducers;
