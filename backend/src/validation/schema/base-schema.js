import { z } from "zod"

const BaseSchema = {
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
    id: z.ulid("Invalid id"),
    token: z.jwt("Invalid token"),
};

export {BaseSchema}

