// backend/validation/schemas.js
const { z } = require('zod');

// Existing password rule: at least 8 chars AND at least one special symbol (!@#$%^&*)
const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;

const registerSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    })
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name must not exceed 50 characters' }),
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    })
        .trim()
        .email({ message: 'Invalid email address' }),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    })
        .refine((val) => passwordRegex.test(val), {
            message: 'Password must be at least 8 characters long and contain at least one special symbol (!@#$%^&*).'
        })
});

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    })
        .trim()
        .email({ message: 'Invalid email address' }),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    })
        .min(1, { message: 'Password is required' })
});

const tagSchema = z.string({
    invalid_type_error: 'Each tag must be a string'
})
    .trim()
    .toLowerCase()
    .min(1, { message: 'Tag cannot be empty' })
    .max(20, { message: 'Each tag must be at most 20 characters' });

const noteSchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string'
    })
        .trim()
        .min(1, { message: 'Title is required' })
        .max(120, { message: 'Title must not exceed 120 characters' }),
    content: z.string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string'
    })
        .trim()
        .min(1, { message: 'Content is required' })
        .max(20000, { message: 'Content must not exceed 20000 characters' }),
    isPublic: z.boolean({
        invalid_type_error: 'isPublic must be a boolean'
    }).optional().default(false),
    tags: z.array(tagSchema, {
        invalid_type_error: 'Tags must be an array of strings'
    }).max(5, { message: 'At most 5 tags are allowed' }).optional().default([]),
    isPinned: z.boolean({
        invalid_type_error: 'isPinned must be a boolean'
    }).optional().default(false),
    isArchived: z.boolean({
        invalid_type_error: 'isArchived must be a boolean'
    }).optional().default(false)
});

// For update note, all fields can be passed as usual or partial, but typically the app passes title, content, isPublic
// Supporting partial or full note update while ensuring string enforcement when provided
const updateNoteSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string'
    })
        .trim()
        .min(1, { message: 'Title cannot be empty' })
        .max(120, { message: 'Title must not exceed 120 characters' })
        .optional(),
    content: z.string({
        invalid_type_error: 'Content must be a string'
    })
        .trim()
        .min(1, { message: 'Content cannot be empty' })
        .max(20000, { message: 'Content must not exceed 20000 characters' })
        .optional(),
    isPublic: z.boolean({
        invalid_type_error: 'isPublic must be a boolean'
    }).optional(),
    tags: z.array(tagSchema, {
        invalid_type_error: 'Tags must be an array of strings'
    }).max(5, { message: 'At most 5 tags are allowed' }).optional(),
    isPinned: z.boolean({
        invalid_type_error: 'isPinned must be a boolean'
    }).optional(),
    isArchived: z.boolean({
        invalid_type_error: 'isArchived must be a boolean'
    }).optional()
}).refine(data => data.title !== undefined || data.content !== undefined || data.isPublic !== undefined || data.tags !== undefined || data.isPinned !== undefined || data.isArchived !== undefined, {
    message: 'At least one field (title, content, isPublic, tags, isPinned, or isArchived) must be provided for update'
});

module.exports = {
    registerSchema,
    loginSchema,
    noteSchema,
    updateNoteSchema
};
