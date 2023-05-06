import { createDomain } from 'effector';

const api = createDomain();

export const sessionFetch = api.createEffect<number, null | { id: number }>({
  handler: (params) => ({ id: 100000 + params }),
});
