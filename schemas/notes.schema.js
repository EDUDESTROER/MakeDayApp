import * as z from 'zod';

const notesSchema = z.strictObject({
        title: z
            .string()
            .trim()
            .min(1, "Note name cannot be empty.")
            .max(120, "Note name must be less than 120 caracteres."),
        parentId: z
            .string()
            .nullable()
            .optional(),
        icon: z
        .string()
        .trim()
        .max(50, "Icon is too big"),
        image: z
        .string()
        .max(255, "Invalid URL")
        .optional()
        .nullable(),
        content: z
        .string()
        .trim()
        .max(20000, "The content is very large.")
        .optional()
        .default(""),
        favorite: z
        .boolean(),
        
    })

export default notesSchema;