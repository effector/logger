import { TransformOptions } from '@babel/core';

export function generateConfig(
  meta: Record<string, unknown>,
): Omit<TransformOptions, 'include' | 'exclude'>;
