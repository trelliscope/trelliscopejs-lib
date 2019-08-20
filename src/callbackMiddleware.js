
const createCallbackMiddleware = (callbacks) => {
  const cbKeys = Object.keys(callbacks);

  // eslint-disable-next-line no-unused-vars
  const callbackMiddleware = (store) => (next) => (action) => {
    if (cbKeys.indexOf(action.type) !== -1) {
      callbacks[action.type]();
    }
    return next(action);
  };

  return callbackMiddleware;
};

export default createCallbackMiddleware;
