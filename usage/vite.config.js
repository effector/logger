import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [babel({ extensions: ['.ts'], babelHelpers: 'bundled' })],
});
