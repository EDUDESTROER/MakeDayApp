import * as z from 'zod';

const backgroundChangeSchema = z.strictObject({
    noteId: z
        .uuid(),
    image: z
        .string()
        .max(255, 'Invalid URL')
        .nullable(),
    oldImage: z
        .string()
        .max(255, 'Invalid URL')
        .optional()
        .nullable(),
});

export default backgroundChangeSchema;