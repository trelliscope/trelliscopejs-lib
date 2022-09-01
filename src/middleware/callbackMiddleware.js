import { selectCallbacks } from '../selectors';

// eslint-disable-next-line no-unused-vars
const callbackMiddleware =
  ({ getState }) =>
  (next) =>
  (action) => {
    const callbacks = selectCallbacks(getState());
    if (!callbacks) {
      return next(action);
    }

    const cbKeys = Object.keys(callbacks);
    if (callbacks && cbKeys.indexOf(action.type) !== -1) {
      callbacks[action.type]();
    }
    return next(action);
  };

export default callbackMiddleware;
