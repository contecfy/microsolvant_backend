/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       required:
 *         - client
 *         - amount
 *         - interestRate
 *         - durationDays
 *       properties:
 *         client:
 *           type: string
 *         amount:
 *           type: number
 *         interestRate:
 *           type: number
 *         durationDays:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, approved, ongoing, completed, defaulted]
 *         riskStatus:
 *           type: string
 *           enum: [green, yellow, red]
 *         repaymentFrequency:
 *           type: string
 *           enum: [daily, weekly, biweekly]
 *         purpose:
 *           type: string
 */
import mongoose, { Schema, Document } from "mongoose";

export interface ILoan extends Document {
    client: mongoose.Types.ObjectId;

    amount: number;
    interestRate: number; // percentage (e.g. 20)
    interestAmount: number;

    totalPayable: number;

    durationDays: number;

    startDate: Date;
    dueDate: Date;

    status: "pending" | "approved" | "ongoing" | "completed" | "defaulted";
    riskStatus: "green" | "yellow" | "red";
    repaymentFrequency: "daily" | "weekly" | "biweekly";

    totalRepaid: number;
    remainingBalance: number;

    penaltyAmount: number;
    isPenaltyApplied: boolean;

    purpose?: string;
    company: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const LoanSchema: Schema<ILoan> = new Schema(
    {
        client: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        interestRate: {
            type: Number,
            required: true,
        },

        interestAmount: {
            type: Number,
            required: true,
        },

        totalPayable: {
            type: Number,
            required: true,
        },

        durationDays: {
            type: Number,
            required: true,
        },

        startDate: {
            type: Date,
        },

        dueDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "ongoing", "completed", "defaulted"],
            default: "pending",
        },

        riskStatus: {
            type: String,
            enum: ["green", "yellow", "red"],
            default: "green",
        },
        
        repaymentFrequency: {
            type: String,
            enum: ["daily", "weekly", "biweekly"],
            default: "daily",
        },

        totalRepaid: {
            type: Number,
            default: 0,
        },

        remainingBalance: {
            type: Number,
        },

        penaltyAmount: {
            type: Number,
            default: 0,
        },

        isPenaltyApplied: {
            type: Boolean,
            default: false,
        },

        purpose: String,
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

export default LoanSchema;