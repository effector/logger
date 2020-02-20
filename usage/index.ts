import './features/session';
import { pageMounted } from './pages/home';

setTimeout(pageMounted, 300, Math.floor(Math.random() * 1000));
