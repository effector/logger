import { CompositeName, Unit } from 'effector';

export const LOGGER_DOMAIN_NAME = '@effector-logger';

export function createName(composite: CompositeName): string {
  return composite.path.filter((name) => name !== LOGGER_DOMAIN_NAME).join('/');
}

export function getPath(unit: Unit<any>): string {
  return (unit as any).defaultConfig?.loc?.file ?? ' ';
}
