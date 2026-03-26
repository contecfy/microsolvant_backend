/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - username
 *         - email
 *         - phone
 *         - password
 *         - nationalId
 *       properties:
 *         fullName:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, investor, client]
 *         nationalId:
 *           type: string
 *         walletBalance:
 *           type: number
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    username: string;
    email: string;
    phone: string;

    password: string;
    pin?: string;

    role: "admin" | "investor" | "client";

    nationalId: string;
    address?: string;
    dateOfBirth?: Date;

    profileImage?: string;

    walletBalance: number;
    totalInvested: number;
    totalEarnings: number;

    isVerified: boolean;
    isActive: boolean;

    lastLogin?: Date;
    company: mongoose.Types.ObjectId;

    comparePassword: (password: string) => Promise<boolean>;
    comparePin: (pin: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false, // hide by default
        },

        pin: {
            type: String,
            select: false, // hidden + secure
        },

        role: {
            type: String,
            enum: ["admin", "investor", "client"],
            default: "client",
        },

        nationalId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        address: String,
        dateOfBirth: Date,
        profileImage: String,

        walletBalance: {
            type: Number,
            default: 0,
        },

        totalInvested: {
            type: Number,
            default: 0,
        },

        totalEarnings: {
            type: Number,
            default: 0,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: Date,
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

export default UserSchema;