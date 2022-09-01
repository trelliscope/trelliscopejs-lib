import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import callbackMiddleware from './middleware/callbackMiddleware';
import crossfilterMiddleware from './middleware/crossfilterMiddleware';
import { hashMiddleware } from './middleware/hash';
import reducers from './reducers';

const store = configureStore({
  reducer: reducers,
  middleware: [thunkMiddleware, crossfilterMiddleware, callbackMiddleware, hashMiddleware],
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
