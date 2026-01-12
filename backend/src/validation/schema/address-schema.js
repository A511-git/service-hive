import { z } from "zod";
import { BaseSchema } from "./base-schema.js";


export const AddressSchema = {
    create: z.object({
        userId: BaseSchema.id,
        street: BaseSchema.street.optional(),
        postalCode: BaseSchema.postalCode,
        city: BaseSchema.city,
        country: BaseSchema.country,
    }),

    update: z.object({
        street: BaseSchema.street.optional(),
        postalCode: BaseSchema.postalCode,
        city: BaseSchema.city,
        country: BaseSchema.country,
    }),

    delete: z.object({
        id: BaseSchema.id,
    }),

};
