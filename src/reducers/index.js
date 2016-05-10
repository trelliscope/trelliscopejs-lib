import { combineReducers } from 'redux';
import sidebar from './sidebar';
import ui from './ui';
import selectedDisplay from './selectedDisplay';
import { layout, labels, sort, filter } from './displayState';
import _displayInfo from './_displayInfo';
import _cogInterface from './_cogInterface';

const app = combineReducers({
  ui,
  sidebar,
  selectedDisplay,
  layout,
  labels,
  sort,
  filter,
  _displayInfo,
  _cogInterface
});

export default app;
