import * as z from 'zod';

const noteNameSchema = z.strictObject({
     id: z
        .uuid(),
    newTitle: z
        .string()
        .trim()
        .min(1, "Note name cannot be empty.")
        .max(120, "Note name must be less than 120 caracteres."),
});

export default noteNameSchema;