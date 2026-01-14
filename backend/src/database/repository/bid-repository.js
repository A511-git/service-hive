import mongoose from "mongoose";
import { BaseRepository } from "./base-repository.js";
import { BidModel, GigModel, UserModel } from "../models/index.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../utils/app-errors.js";
import { MapMongoError } from "../../utils/map-mongo-error.js";

class BidRepository extends BaseRepository {
    constructor() {
        super(BidModel);
    }

    async find(filter) {
        try {
            return await this.model.find(filter).populate("freelancerId");
        } catch (error) {
            throw MapMongoError(error);
        }
    }

    async hire({ bidId, userId }) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const bid = await BidModel.findById(bidId).session(session);
            if (!bid) throw new NotFoundError("Bid not found");

            const gig = await GigModel.findById(bid.gigId).session(session);
            if (!gig) throw new NotFoundError("Gig not found");

            if (String(gig.clientId) !== String(userId))
                throw new UnauthorizedError("Only gig owner can hire");

            if (gig.status !== "open")
                throw new BadRequestError("Gig already assigned");

            gig.status = "assigned";
            await gig.save({ session });

            bid.status = "hired";
            await bid.save({ session });

            await BidModel.updateMany(
                { gigId: gig._id, _id: { $ne: bid._id } },
                { $set: { status: "rejected" } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return { gigId: gig._id, hiredBidId: bid._id };
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            if (
                err instanceof NotFoundError ||
                err instanceof UnauthorizedError ||
                err instanceof BadRequestError
            ) throw err;

            throw MapMongoError(err);
        }
    }
}

export { BidRepository };
