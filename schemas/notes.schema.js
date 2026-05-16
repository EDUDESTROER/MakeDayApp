import * as z from 'zod';

const blockSchema = z.object({
    id: z
        .string()
        .min(1),
    type: z
        .enum(["paragraph", "heading", "list"]),
    content: z
        .string()
        .max(20000),
    parentId: z
        .string()
        .nullable()
        .optional(),
    children: z
        .array(z.string())

});

const contentSchema = z.object({
    byId: z
        .record(z.string(), blockSchema),
    rootIds: z
        .array(z.string())
});

const notesSchema = z.strictObject({
        id: z
            .uuid(),
        title: z
            .string()
            .trim()
            .min(1, "Note name cannot be empty.")
            .max(120, "Note name must be less than 120 caracteres."),
        parentId: z
            .string()
            .nullable()
            .optional(),
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
            .min(1, "icon is required")
            .max(10, "Invalid emoji")
            .refine((value)=>{
                return /\p{Extended_Pictographic}/u.test(value);
            }, "Invalid emoji")
            .optional(),
        image: z
            .string()
            .max(255, "Invalid URL")
            .optional()
            .nullable(),
        content: contentSchema,
        favorite: z
            .boolean(),
    })

export default notesSchema;