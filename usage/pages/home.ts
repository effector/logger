import { createEvent, forward } from '../../src';
import { sessionFetch } from '../api/session';

export const pageMounted = createEvent<number>();

forward({
  from: pageMounted,
  to: sessionFetch,
});
