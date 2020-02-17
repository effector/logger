import { CompositeName, Unit } from 'effector';

export function createName(composite: CompositeName): string {
  return composite.path.slice(1).join('/');
}

export function getPath(unit: Unit<any>): string {
  return (unit as any).defaultConfig?.loc?.file ?? ' ';
}
