/**
 * @swagger
 * components:
 *   schemas:
 *     Investment:
 *       type: object
 *       required:
 *         - investor
 *         - loan
 *         - amount
 *       properties:
 *         investor:
 *           type: string
 *           description: User ID of the investor
 *         loan:
 *           type: string
 *           description: Loan ID
 *         amount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [active, completed]
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IInvestment extends Document {
    investor: mongoose.Types.ObjectId;
    loan: mongoose.Types.ObjectId;

    amount: number;

    expectedReturn: number;
    profit: number;

    status: "active" | "completed";
    company: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const InvestmentSchema: Schema<IInvestment> = new Schema(
    {
        investor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        loan: {
            type: Schema.Types.ObjectId,
            ref: "Loan",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        expectedReturn: {
            type: Number,
            required: true,
        },

        profit: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
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

export default InvestmentSchema;