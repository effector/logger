import { createInspector as create } from 'effector-inspector'

let initialized = false;

export function createInspector(): void {
  if (initialized) return;
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    create({ visible: false })
    initialized = true;
  }
}

createInspector();
