import mongoose from "mongoose";

const BidSchema = new mongoose.Schema(
    {
        gigId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gig",
            required: true,
            index: true,
        },

        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["pending", "hired", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

BidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
export const BidModel = mongoose.model("Bid", BidSchema);
