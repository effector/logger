import {
  createNode,
  is,
  step,
  Domain,
  Scope,
  CompositeName,
  Unit,
  Node,
} from 'effector';

export const LOGGER_DOMAIN_NAME = '@effector-logger';

export function createName(composite: CompositeName): string {
  return composite.path.filter((name) => name !== LOGGER_DOMAIN_NAME).join('/');
}

export function getPath(unit: Unit<any>): string {
  return (unit as any).defaultConfig?.loc?.file ?? ' ';
}

export function watch(
  unit: Unit<any>,
  source: Domain | Scope,
  fn: (payload: any) => any,
): void {
  if (is.store(unit)) {
    fn((source as Scope).getState?.(unit) || unit.getState());
  }
  const watchUnit = is.store(unit) ? unit.updates : unit;
  if (is.domain(source)) {
    (watchUnit as any).watch(fn);
  } else {
    createNode({
      node: [step.run({ fn })],
      parent: (source as any).find(watchUnit),
    });
  }
}
