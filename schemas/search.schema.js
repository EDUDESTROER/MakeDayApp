import * as z from 'zod';

const searchSchema = z.strictObject({
    term: z
        .string()
        .min(3, 'too small, search need to have at least 3 caracteres')
        .max(100)
        .transform(term => term.replace(/\s+/g, ' '))
});

export default searchSchema;