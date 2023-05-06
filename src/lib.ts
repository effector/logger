/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Message, Declaration } from 'effector/inspect';
import type { Unit, Node, Scope } from 'effector';

export function getName(m: Message | Declaration, loggerName: string) {
  const finalName = m.name || locToString(m.loc) || `unknown_${m.id}`;

  if (!loggerName) return finalName;

  return `(${loggerName}) ${finalName}`;
}
export function locToString(loc: any) {
  if (!loc) return null;
  return `${loc.file}:${loc.line}:${loc.column}`;
}
export function getNode(unit: Unit<any>) {
  return (unit as any).graphite as Node;
}

export function getStateFromDeclaration(d: Declaration, scope?: Scope) {
  return d.meta.defaultState;
}
