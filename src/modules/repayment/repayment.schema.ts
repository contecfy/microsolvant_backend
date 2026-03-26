/**
 * @swagger
 * components:
 *   schemas:
 *     Repayment:
 *       type: object
 *       required:
 *         - loan
 *         - client
 *         - amount
 *         - paymentMethod
 *       properties:
 *         loan:
 *           type: string
 *         client:
 *           type: string
 *         amount:
 *           type: number
 *         paymentMethod:
 *           type: string
 *           enum: [cash, mobile_money, bank]
 *         reference:
 *           type: string
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IRepayment extends Document {
    loan: mongoose.Types.ObjectId;
    client: mongoose.Types.ObjectId;

    amount: number;

    paymentMethod: "cash" | "mobile_money" | "bank";

    reference?: string; // transaction ID (MTN/Airtel/etc)

    note?: string;
    company: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const RepaymentSchema: Schema<IRepayment> = new Schema(
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

        amount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "mobile_money", "bank"],
            required: true,
        },

        reference: String,

        note: String,
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

export default RepaymentSchema;