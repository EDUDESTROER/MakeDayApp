import * as z from 'zod'

const loginSchema = z.union([
    z.strictObject({
        email: z
        .email()
        .trim()
        .toLowerCase()
        .max(255),
        password: z
        .string()
        .trim()
        .min(8)
        .max(128)
    }),
    z.strictObject({
        email: z
        .string()
        .trim()
        .min(3)
        .max(255),
        password: z
        .string()
        .trim()
        .min(8)
        .max(128)
    })
]);

export default loginSchema;

/* 
export const loginEmailSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

export const loginUsernameSchema = z.object({
    email: z.string().min(3),
    password: z.string().min(8)
});
*/