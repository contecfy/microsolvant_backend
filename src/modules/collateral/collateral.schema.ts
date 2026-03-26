/**
 * @swagger
 * components:
 *   schemas:
 *     Collateral:
 *       type: object
 *       required:
 *         - loan
 *         - client
 *         - type
 *         - description
 *         - value
 *       properties:
 *         loan:
 *           type: string
 *         client:
 *           type: string
 *         type:
 *           type: string
 *           enum: [car, land, phone, electronics, other]
 *         description:
 *           type: string
 *         value:
 *           type: number
 *         status:
 *           type: string
 *           enum: [secured, at_risk, seized, released]
 */
import mongoose, { Schema, Document } from "mongoose";

export interface ICollateral extends Document {
    loan: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;

    type: "car" | "land" | "phone" | "electronics" | "other";

    description: string;

    value: number;

    images: string[]; // Cloudinary URLs

    location?: {
        lat: number;
        lng: number;
        address?: string;
    };

    status: "secured" | "at_risk" | "seized" | "released";

    verified: boolean;
    company: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const CollateralSchema: Schema<ICollateral> = new Schema(
    {
        loan: {
            type: Schema.Types.ObjectId,
            ref: "Loan",
            required: true,
        },

        client: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["car", "land", "phone", "electronics", "other"],
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        value: {
            type: Number,
            required: true,
        },

        images: [
            {
                type: String,
            },
        ],

        location: {
            lat: Number,
            lng: Number,
            address: String,
        },

        status: {
            type: String,
            enum: ["secured", "at_risk", "seized", "released"],
            default: "secured",
        },

        verified: {
            type: Boolean,
            default: false,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default CollateralSchema;