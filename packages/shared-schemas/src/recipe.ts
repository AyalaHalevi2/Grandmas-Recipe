import * as v from 'valibot';

// Kosher types
export const KosherTypeSchema = v.picklist(
  ['Parve', 'Dairy', 'Meat'],
  'סוג כשרות לא תקין'
);

// Recipe field schemas
export const RecipeTitleSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'שם המתכון חייב להכיל לפחות 2 תווים'),
  v.maxLength(200, 'שם המתכון ארוך מדי')
);

// MongoDB ObjectId format for category reference
export const RecipeCategorySchema = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{24}$/, 'מזהה קטגוריה לא תקין')
);

export const IngredientSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'מרכיב לא יכול להיות ריק')
);

export const InstructionSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'הוראה לא יכולה להיות ריקה')
);

export const PrepTimeSchema = v.pipe(
  v.number(),
  v.minValue(1, 'זמן הכנה חייב להיות לפחות דקה אחת'),
  v.maxValue(10000, 'זמן הכנה לא סביר')
);

export const DifficultySchema = v.pipe(
  v.number(),
  v.integer('רמת קושי חייבת להיות מספר שלם'),
  v.minValue(1, 'רמת קושי חייבת להיות לפחות 1'),
  v.maxValue(5, 'רמת קושי יכולה להיות עד 5')
);

export const RatingValueSchema = v.pipe(
  v.number(),
  v.minValue(0, 'דירוג חייב להיות לפחות 0'),
  v.maxValue(5, 'דירוג יכול להיות עד 5')
);

export const ImageUrlSchema = v.optional(
  v.pipe(
    v.string(),
    v.trim()
  ),
  ''
);

// Create recipe schema
export const CreateRecipeSchema = v.object({
  title: RecipeTitleSchema,
  category: RecipeCategorySchema,
  ingredients: v.pipe(
    v.array(IngredientSchema),
    v.minLength(1, 'נדרש לפחות מרכיב אחד')
  ),
  instructions: v.pipe(
    v.array(InstructionSchema),
    v.minLength(1, 'נדרשת לפחות הוראה אחת')
  ),
  prepTime: PrepTimeSchema,
  difficulty: DifficultySchema,
  imageUrl: ImageUrlSchema,
  isYemeni: v.optional(v.boolean(), false),
  kosherType: v.optional(KosherTypeSchema, 'Parve')
}, 'נדרשים פרטי מתכון');

// Update recipe schema (all fields optional except at least one required)
export const UpdateRecipeSchema = v.partial(CreateRecipeSchema);

// Rate recipe schema
export const RateRecipeSchema = v.object({
  rating: RatingValueSchema
}, 'נדרש דירוג');

// Recipe ID schema (MongoDB ObjectId format)
export const RecipeIdSchema = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{24}$/, 'מזהה מתכון לא תקין')
);

// Types inferred from schemas
export type KosherType = v.InferOutput<typeof KosherTypeSchema>;
export type CreateRecipeInput = v.InferInput<typeof CreateRecipeSchema>;
export type CreateRecipeOutput = v.InferOutput<typeof CreateRecipeSchema>;
export type UpdateRecipeInput = v.InferInput<typeof UpdateRecipeSchema>;
export type UpdateRecipeOutput = v.InferOutput<typeof UpdateRecipeSchema>;
export type RateRecipeInput = v.InferInput<typeof RateRecipeSchema>;
