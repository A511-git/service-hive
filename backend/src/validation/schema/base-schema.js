import { z } from "zod"

const BaseSchema = {
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    id: z.ulid("Invalid id"),
    token: z.jwt("Invalid token"),
    street: z.string().min(3, "Street must be at least 3 characters long").max(100, "Street must be at most 100 characters long"),
    postalCode: z.string().min(5, "Postal code must be at least 5 characters long").max(15, "Postal code must be at most 15 characters long"),
    city: z.string().min(3, "City must be at least 3 characters long").max(50, "City must be at most 50 characters long"),
    country: z.string().min(3, "Country must be at least 3 characters long").max(50, "Country must be at most 50 characters long"),
};

export {BaseSchema}

