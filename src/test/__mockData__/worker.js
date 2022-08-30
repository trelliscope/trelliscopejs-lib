import { setupWorker } from 'msw';
import restHandlers from './restHandlers';

export default setupWorker(...restHandlers);
