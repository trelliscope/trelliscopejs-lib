import { selectCallbacks } from '../selectors';

interface GetStateProps {
  getState: () => void;
}

// eslint-disable-next-line no-unused-vars
const callbackMiddleware =
  ({ getState }: GetStateProps) =>
  (next: (arg0: { type: string }) => void) =>
  (action: { type: string }) => {
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
