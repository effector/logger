import { createInspector as create } from 'effector-inspector';
import { LOGGER_DOMAIN_NAME } from './lib';

let initialized = false;

export function createInspector(): void {
  if (initialized) return;
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    create({ visible: false, trimDomain: LOGGER_DOMAIN_NAME });
    initialized = true;
  }
}

createInspector();
