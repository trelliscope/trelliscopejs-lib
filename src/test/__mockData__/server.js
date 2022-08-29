import { setupServer } from 'msw/node';
import restHandlers from './restHandlers';

export default setupServer(...restHandlers);
