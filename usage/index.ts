import './features/session';
import { pageMounted } from './pages/home';
import '../src/inspector';

setTimeout(pageMounted, 300, Math.floor(Math.random() * 1000));
