import { z } from "zod";

export const GigSchema = {
    create: z.object({
        title: z.string().min(3).max(200),
        description: z.string().min(10).max(5000),
        budget: z.number().min(0),
        deadline: z.coerce.date(),
    }),

    update: z.object({
        id: z.string().min(1),
        title: z.string().min(3).max(200).optional(),
        description: z.string().min(10).max(5000).optional(),
        budget: z.number().min(0).optional(),
        deadline: z.coerce.date().optional(),
        status: z.enum(["open", "in_progress", "closed"]).optional(),
    }),

    getAll: z.object({
        search: z.string().optional(),
        page: z.coerce.number().optional(),
        limit: z.coerce.number().optional(),
    }),

    getById: z.object({
        id: z.string().min(1),
    }),
};
