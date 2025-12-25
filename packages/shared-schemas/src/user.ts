import * as v from 'valibot';

// Reusable field schemas
export const EmailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.toLowerCase(),
  v.email('כתובת אימייל לא תקינה'),
  v.maxLength(255, 'כתובת אימייל ארוכה מדי')
);

export const PasswordSchema = v.pipe(
  v.string(),
  v.minLength(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  v.maxLength(128, 'סיסמה ארוכה מדי')
);

export const FullNameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'שם מלא חייב להכיל לפחות 2 תווים'),
  v.maxLength(100, 'שם מלא ארוך מדי')
);

// Register schema (server-side - no confirmPassword needed)
export const RegisterSchema = v.object({
  email: EmailSchema,
  fullName: FullNameSchema,
  password: PasswordSchema
}, 'נדרשים פרטי הרשמה');

// Client-side schema with password confirmation
const RegisterFormSchema = v.object({
  email: EmailSchema,
  fullName: FullNameSchema,
  password: PasswordSchema,
  confirmPassword: v.string()
}, 'נדרשים פרטי הרשמה');

export const RegisterWithConfirmSchema = v.pipe(
  RegisterFormSchema,
  v.rawCheck(({ dataset, addIssue }) => {
    if (dataset.typed && dataset.value.password !== dataset.value.confirmPassword) {
      addIssue({
        message: 'הסיסמאות אינן תואמות',
        path: [
          {
            type: 'object',
            origin: 'value',
            input: dataset.value,
            key: 'confirmPassword',
            value: dataset.value.confirmPassword,
          },
        ],
      });
    }
  })
);

// Login schema
export const LoginSchema = v.object({
  email: EmailSchema,
  password: v.pipe(
    v.string(),
    v.minLength(1, 'נדרשת סיסמה')
  )
}, 'נדרשים פרטי התחברות');

// User role schema
export const UserRoleSchema = v.picklist(['admin', 'user'], 'תפקיד לא תקין');

// Types inferred from schemas
export type RegisterInput = v.InferInput<typeof RegisterSchema>;
export type RegisterOutput = v.InferOutput<typeof RegisterSchema>;
export type LoginInput = v.InferInput<typeof LoginSchema>;
export type LoginOutput = v.InferOutput<typeof LoginSchema>;
export type UserRole = v.InferOutput<typeof UserRoleSchema>;
