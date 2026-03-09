import * as z from 'zod';

const registerSchema = z.strictObject({
    nickName: z
        .string()
        .trim()
        .min(3, "Nickname must have more than 3 characters")
        .max(30, "Nickname must have less than 30 characters")
        .regex(/^[a-zA-Z](?:[a-zA-Z0-9_]{2,14}[a-zA-Z0-9])$/, "Nickname can only contain letters, numbers and underscore"),
    firstName: z
        .string()
        .trim()
        .min(2, "First Name is too short")
        .max(50, "First name is too long"),
    lastName: z
        .string()
        .trim()
        .min(2, "Last Name is too short")
        .max(50, "Last Name is too long"),
    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase()
        .max(255, "Email is too long"),
    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 caracteres")
        .max(128, "Password too long")
        .regex(/.{8,}/, "Password must to be at least 8 caracteres, no spaces")
        .regex(/(?=.*[A-Za-z])/, "Password must contain at least one letter")
        .regex(/(?=.*\d)/, "Password must contain at least one number"),
    confirmPassword: z
        .string(),
    terms: z
        .literal(true, {
            errorMap: () => ({ message: "You must accept the terms" }),
        }),

}).superRefine((data, ctx)=>{
    if(data.password !== data.confirmPassword){
        ctx.addIssue({
            path: ["confirmPassword"],
            message: "Passwords do not match",
        });
    }
}).transform(({confirmPassword, ...rest})=> rest);

export default registerSchema;