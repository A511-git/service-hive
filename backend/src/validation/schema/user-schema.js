import { z } from "zod";
import { BaseSchema } from "./base-schema.js";


export const UserSchema = {
    register: z.object({
        name: BaseSchema.name,
        email: BaseSchema.email,
        password: BaseSchema.password,
    }),

    login: z.object({
        email: BaseSchema.email,
        password: BaseSchema.password,
    }),

    refresh: z.object({
        token: BaseSchema.token,
    }),
};
