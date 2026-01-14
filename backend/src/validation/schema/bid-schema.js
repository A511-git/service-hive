import { z } from "zod";

export const BidSchema = {
    create: z.object({
        gigId: z.string().min(1),
        message: z.string().min(3).max(2000),
        price: z.number().min(0),
    }),

    find: z.object({
        gigId: z.string().min(1),
    }),

    hire: z.object({
        bidId: z.string().min(1),
    }),
};
