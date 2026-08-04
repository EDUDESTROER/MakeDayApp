import * as z from 'zod';

const noteIconSchema = z.strictObject({
     id: z
        .uuid(),
    icon: z
        .string()
        .trim()
        .transform(val => val === "" ? undefined : val)
        .refine(
            v => !v || /^fa-[a-z-]+ fa-[a-z-]+$/.test(v),
            "Invalid icon format"
        )
        .optional(),
    emoji:z
        .string()
        .max(10, "Invalid emoji")
        .refine(
            (value) => value === "" || /\p{Extended_Pictographic}/u.test(value),
            "Invalid emoji"
        )
        .optional(),
});

export default noteIconSchema;