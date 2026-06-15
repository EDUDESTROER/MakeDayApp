import * as z from 'zod';

const nicknameSchema = z.strictObject({
    nickname: z
        .string()
        .trim()
        .min(3, "Nickname must have more than 3 characters")
        .max(30, "Nickname must have less than 30 characters")
        .regex(/^[a-zA-Z](?:[a-zA-Z0-9_]{2,14}[a-zA-Z0-9])$/, "Nickname can only contain letters, numbers and underscore"),
    password: z
        .string()
        .trim()
        .min(8, "Invalid password")
        .max(128, "Invalid password")
        .regex(/.{8,}/, "Invalid password")
        .regex(/(?=.*[A-Za-z])/, "Invalid password")
        .regex(/(?=.*\d)/, "Invalid password"),
});

export default nicknameSchema;