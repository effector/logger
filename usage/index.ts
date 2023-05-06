import { fork, scopeBind } from 'effector';
import { attachLogger } from '../src';

import { $session } from './features/session';
import { pageMounted } from './pages/home';

const scope = fork({
  values: [[$session, { id: 'lol' }]],
});

attachLogger({
  scope,
});

attachLogger({
  name: 'my-cool-app',
});

setTimeout(pageMounted, 500, Math.floor(Math.random() * 3000));
setTimeout(pageMounted, 1000, Math.floor(Math.random() * 3000));
setTimeout(pageMounted, 1500, Math.floor(Math.random() * 3000));
setTimeout(pageMounted, 2000, Math.floor(Math.random() * 3000));
setTimeout(scopeBind(pageMounted, { scope }), 2500, Math.floor(Math.random() * 3000));
