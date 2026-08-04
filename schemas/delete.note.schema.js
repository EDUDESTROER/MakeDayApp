import * as z from 'zod';

const deleteNoteSchema = z.strictObject({
    id: z
        .uuid(),
    image: z
        .string()
        .max(255, 'Invalid URL')
        .optional()
        .nullable(),
    password: z
        .string()
        .trim()
        .min(8)
        .max(128),
});

export default deleteNoteSchema;