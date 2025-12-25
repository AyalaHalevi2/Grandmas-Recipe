import * as v from 'valibot';

export type ValidationResult<T> =
  | { success: true; data: T; errors: null }
  | { success: false; data: null; errors: Record<string, string> };

/**
 * Simple validation function - one source of truth for client & server
 *
 * @example
 * const result = validate(LoginSchema, { email: 'test@test.com', password: '123' });
 * if (!result.success) {
 *   console.log(result.errors); // { password: 'סיסמה חייבת להכיל לפחות 6 תווים' }
 * }
 */
export function validate<T extends v.GenericSchema>(
  schema: T,
  data: unknown
): ValidationResult<v.InferOutput<T>> {
  const result = v.safeParse(schema, data);

  if (result.success) {
    return { success: true, data: result.output, errors: null };
  }

  // Flatten errors to simple { fieldName: "error message" } format
  const errors: Record<string, string> = {};
  for (const issue of result.issues) {
    const path = issue.path?.[0]?.key;
    if (typeof path === 'string' && !errors[path]) {
      errors[path] = issue.message;
    }
  }

  // If no field-specific errors, use root error
  if (Object.keys(errors).length === 0 && result.issues[0]) {
    errors._root = result.issues[0].message;
  }

  return { success: false, data: null, errors };
}
