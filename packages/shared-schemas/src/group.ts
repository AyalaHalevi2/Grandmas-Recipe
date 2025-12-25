import * as v from 'valibot';
import { EmailSchema } from './user';

// Reusable field schemas
export const GroupNameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'שם הקבוצה חייב להכיל לפחות 2 תווים'),
  v.maxLength(100, 'שם הקבוצה ארוך מדי')
);

export const GroupDescriptionSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(500, 'תיאור הקבוצה ארוך מדי')
);

export const GroupPrivacySchema = v.picklist(
  ['public', 'private'],
  'סוג פרטיות לא תקין'
);

export const GroupRoleSchema = v.picklist(
  ['admin', 'contributor', 'member'],
  'תפקיד בקבוצה לא תקין'
);

export const RecipeVisibilitySchema = v.picklist(
  ['private', 'group', 'public'],
  'רמת נראות לא תקינה'
);

// MongoDB ObjectId validation
export const MongoIdSchema = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{24}$/, 'מזהה לא תקין')
);

// Create Group schema
export const CreateGroupSchema = v.object({
  name: GroupNameSchema,
  description: v.optional(GroupDescriptionSchema, ''),
  privacy: v.optional(GroupPrivacySchema, 'public')
}, 'נדרשים פרטי הקבוצה');

// Update Group schema (all fields optional)
export const UpdateGroupSchema = v.object({
  name: v.optional(GroupNameSchema),
  description: v.optional(GroupDescriptionSchema),
  privacy: v.optional(GroupPrivacySchema)
}, 'נדרשים פרטים לעדכון');

// Invite Member schema (by email)
export const InviteMemberSchema = v.object({
  email: EmailSchema
}, 'נדרש אימייל של המשתמש');

// Update Member Role schema
export const UpdateMemberRoleSchema = v.object({
  role: GroupRoleSchema
}, 'נדרש תפקיד תקין');

// Group ID validation schema
export const GroupIdSchema = v.object({
  id: MongoIdSchema
}, 'נדרש מזהה קבוצה תקין');

// Update Recipe with Group schema
export const UpdateRecipeVisibilitySchema = v.object({
  visibility: RecipeVisibilitySchema,
  groupIds: v.optional(v.array(MongoIdSchema), [])
});

// Types inferred from schemas
export type CreateGroupInput = v.InferInput<typeof CreateGroupSchema>;
export type CreateGroupOutput = v.InferOutput<typeof CreateGroupSchema>;
export type UpdateGroupInput = v.InferInput<typeof UpdateGroupSchema>;
export type UpdateGroupOutput = v.InferOutput<typeof UpdateGroupSchema>;
export type InviteMemberInput = v.InferInput<typeof InviteMemberSchema>;
export type InviteMemberOutput = v.InferOutput<typeof InviteMemberSchema>;
export type UpdateMemberRoleInput = v.InferInput<typeof UpdateMemberRoleSchema>;
export type UpdateMemberRoleOutput = v.InferOutput<typeof UpdateMemberRoleSchema>;
export type GroupRole = v.InferOutput<typeof GroupRoleSchema>;
export type GroupPrivacy = v.InferOutput<typeof GroupPrivacySchema>;
export type RecipeVisibility = v.InferOutput<typeof RecipeVisibilitySchema>;
