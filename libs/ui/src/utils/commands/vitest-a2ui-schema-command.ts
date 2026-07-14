/**
 * Vitest browser command (runs on Node): validate A2UI spec against A2UI_SPEC_SCHEMA.
 * Returns { valid: true } or { valid: false, errors } — does not throw.
 */
import type { BrowserCommand } from 'vitest/node';
import Ajv, { ValidateFunction } from 'ajv';
import { A2UI_SPEC_SCHEMA } from '../../ai';

let ajv: Ajv;
let validateSpec: ValidateFunction;

export type ValidateA2uiSpecResult = { valid: boolean; errors: string };

export const validateA2uiSpecCommand: BrowserCommand<[spec: unknown], ValidateA2uiSpecResult> = async (
  _context,
  spec
) => {
  if (!validateSpec) {
    ajv = new Ajv({
      allErrors: true,
      strict: false,
    });

    validateSpec = ajv.compile(A2UI_SPEC_SCHEMA);
  }

  if (validateSpec(spec)) return { valid: true, errors: '' };

  return {
    valid: false,
    errors: ajv.errorsText(validateSpec.errors, { separator: '\n' }),
  };
};
