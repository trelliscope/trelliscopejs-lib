import { combineReducers } from 'redux';
import sidebar from './sidebar';
import ui from './ui';
import currentDisplay from './currentDisplay';
import { layout, labels, sort, filter } from './displayState';

const app = combineReducers({
  ui,
  sidebar,
  currentDisplay,
  layout,
  labels,
  sort,
  filter
});

export default app;
