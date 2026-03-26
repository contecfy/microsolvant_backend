/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - loan
 *         - dueDate
 *         - expectedAmount
 *       properties:
 *         loan:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         expectedAmount:
 *           type: number
 *         paidAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, paid, missed, partially_paid]
 */
import mongoose, { Schema, Document } from "mongoose";

export interface ISchedule extends Document {
    loan: mongoose.Types.ObjectId;
    dueDate: Date;
    expectedAmount: number;
    paidAmount: number;
    status: "pending" | "paid" | "missed" | "partially_paid";
    company: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ScheduleSchema: Schema<ISchedule> = new Schema(
    {
        loan: {
            type: Schema.Types.ObjectId,
            ref: "Loan",
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        expectedAmount: {
            type: Number,
            required: true,
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "missed", "partially_paid"],
            default: "pending",
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

export default ScheduleSchema;
