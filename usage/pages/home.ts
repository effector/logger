import { createEvent, forward } from 'effector';
import { sessionFetch } from '../api/session';

export const pageMounted = createEvent<number>();

forward({
  from: pageMounted,
  to: sessionFetch,
});
