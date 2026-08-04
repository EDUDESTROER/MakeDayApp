import * as z from 'zod';

const updateFavoriteSchema = z.strictObject({
    id: z
        .uuid(),
    favorite: z
        .number(),
});

export default updateFavoriteSchema;