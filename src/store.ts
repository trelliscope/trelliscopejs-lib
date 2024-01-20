import { configureStore } from '@reduxjs/toolkit';
import callbackMiddleware from './middleware/callbackMiddleware';
import { hashMiddleware } from './middleware/hash';
import { configAPI } from './slices/configAPI';
import { displayListAPI } from './slices/displayListAPI';
import reducer from './reducers';
import { displayInfoAPI } from './slices/displayInfoAPI';
import { htmlAPI } from './slices/htmlAPI';

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware: any) => getDefaultMiddleware().concat(    
    htmlAPI.middleware,
    configAPI.middleware,
    displayListAPI.middleware,
    displayInfoAPI.middleware,
    callbackMiddleware,
    hashMiddleware,
  ),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
