import express from "express";
import { AsyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserAuth } from "./middlewares/auth.js";
import { GigService } from "../services/index.js";
import { GigValidator } from "../validation/index.js";

export const gig = () => {
    const router = express.Router();

    const gigService = new GigService();
    const gigValidator = new GigValidator();

    router.get("/", AsyncHandler(async (req, res) => {
        const data = gigValidator.getAll(req.query);
        const result = await gigService.getAll(data);
        res.status(200).json(new ApiResponse(200, result, "Gigs fetched"));
    }));

    router.post("/", UserAuth, AsyncHandler(async (req, res) => {
        const data = gigValidator.create(req.body);
        const result = await gigService.create({
            userId: req.user._id,
            ...data,
        });
        res.status(201).json(new ApiResponse(201, result, "Gig created"));
    }));

    router.patch("/:id", UserAuth, AsyncHandler(async (req, res) => {
        const data = gigValidator.update({ id: req.params.id, ...req.body });
        const result = await gigService.update(data.id, {
            userId: req.user._id,
            ...data,
        });
        res.status(200).json(new ApiResponse(200, result, "Gig updated"));
    }));

    return router;
};
