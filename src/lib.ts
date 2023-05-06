/* eslint-disable @typescript-eslint/camelcase */
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
  if (scope) {
    return HACK_readStateFromScope(d, scope);
  }

  return d.meta.defaultState;
}

function HACK_readStateFromScope(d: Declaration, scope: Scope) {
  const stateRefId = d.meta.rootStateRefId as any;

  const scopeRef = (scope as any).reg[stateRefId];

  if (scopeRef) {
    return scopeRef.current;
  }

  if (stateRefId in (scope as any).values.idMap) {
    return { value: (scope as any).values.idMap[stateRefId] };
  }

  const sid = d.meta.sid as any;

  if (sid && sid in (scope as any).values.sidMap) {
    return (scope as any).values.sidMap[sid];
  }

  return d.meta.defaultState;
}
