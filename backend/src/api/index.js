import { user } from "./user.js";
import { gig } from "./gig.js";
import { bid } from "./bid.js";
import { Router } from "express";

export const api = () => {
    const router = Router();

    router.get("/ping", (req, res) => {
        res.send("pong");
    });

    router.use("/auth", user());
    router.use("/gigs", gig());
    router.use("/bids", bid());

    return router;
};
