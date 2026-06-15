import * as z from 'zod';

const nameSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(2, "name is too short")
        .max(75, "name is too long"),
    password: z
        .string()
        .trim()
        .min(8, "Invalid password")
        .max(128, "Invalid password")
        .regex(/.{8,}/, "Invalid password")
        .regex(/(?=.*[A-Za-z])/, "Invalid password")
        .regex(/(?=.*\d)/, "Invalid password"),
});

export default nameSchema;