import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import callbackMiddleware from './middleware/callbackMiddleware';
// import crossfilterMiddleware from './middleware/crossfilterMiddleware';
import { hashMiddleware } from './middleware/hash';
import { configAPI } from './slices/configAPI';
import { displayListAPI } from './slices/displayListAPI';
import reducer from './reducers';
import { metaDataAPI } from './slices/metaDataAPI';
import { displayInfoAPI } from './slices/displayInfoAPI';

const store = configureStore({
  reducer,
  middleware: [
    configAPI.middleware,
    displayListAPI.middleware,
    displayInfoAPI.middleware,
    metaDataAPI.middleware,
    thunkMiddleware,
    // crossfilterMiddleware,
    callbackMiddleware,
    hashMiddleware,
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
