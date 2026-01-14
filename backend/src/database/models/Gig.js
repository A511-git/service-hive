import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const GigSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },

        budget: {
            type: Number,
            required: true,
            min: 0,
        },

        deadline: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["open", "assigned"],
            default: "open",
        },
    },
    { timestamps: true }
);
GigSchema.plugin(mongoosePaginate);
export const GigModel = mongoose.model("Gig", GigSchema);
