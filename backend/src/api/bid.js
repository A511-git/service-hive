import express from "express";
import { AsyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserAuth } from "./middlewares/auth.js";
import { BidService } from "../services/index.js";
import { BidValidator } from "../validation/index.js";

export const bid = () => {
    const router = express.Router();

    const bidService = new BidService();
    const bidValidator = new BidValidator();

    router.post("/", UserAuth, AsyncHandler(async (req, res) => {
        const data = bidValidator.create(req.body);
        const result = await bidService.create({
            freelancerId: req.user._id,
            ...data,
        });
        res.status(201).json(new ApiResponse(201, result, "Bid created"));
    }));

    router.get("/:gigId", UserAuth, AsyncHandler(async (req, res) => {
        const data = bidValidator.getAll({ gigId: req.params.gigId });
        const result = await bidService.getAll({
            gigId: data.gigId,
            userId: req.user._id,
        });
        res.status(200).json(new ApiResponse(200, result, "Bids fetched"));
    }));

    router.patch("/:bidId/hire", UserAuth, AsyncHandler(async (req, res) => {
        const data = bidValidator.hire({ bidId: req.params.bidId });
        const result = await bidService.hire({
            bidId: data.bidId,
            userId: req.user._id,
        });
        res.status(200).json(new ApiResponse(200, result, "Bid hired"));
    }));

    return router;
};
