import { fork, scopeBind } from 'effector';
import { attachLogger } from '../src';

import './features/session';
import { pageMounted } from './pages/home';

attachLogger({
  name: 'my-cool-app',
});

const scope = fork();

attachLogger({
  scope,
});

setTimeout(pageMounted, 500, Math.floor(Math.random() * 3000));
setTimeout(pageMounted, 1000, Math.floor(Math.random() * 3000));
setTimeout(pageMounted, 1500, Math.floor(Math.random() * 3000));
setTimeout(pageMounted, 2000, Math.floor(Math.random() * 3000));
setTimeout(scopeBind(pageMounted, { scope }), 2500, Math.floor(Math.random() * 3000));
