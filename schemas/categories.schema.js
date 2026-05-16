import * as z from 'zod';

const categoriesSchema = z.strictObject({
        title: z
            .string()
            .trim()
            .min(1, "Category name cannot be empty.")
            .max(32, "Category name must be less than 32 caracteres."),
        viewMode: z
            .enum(["list", "card"], {
                errorMap: () => ({message: "Invalid view mode."})
            }),
        parentId: z
            .string()
            .nullable()
            .optional()
    })

export default categoriesSchema;