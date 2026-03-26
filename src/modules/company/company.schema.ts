import mongoose, { Schema, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - registrationNumber
 *       properties:
 *         name:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         interestRate:
 *           type: number
 *         canChangeInterest:
 *           type: boolean
 */

export interface ICompany extends Document {
  name: string;
  registrationNumber: string;

  email?: string;
  phone?: string;

  address?: string;

  interestRate: number; // default rate (e.g. 20%)

  interestRateLastUpdated: Date;

  canChangeInterest: boolean;

  policy?: string; // privacy policy / terms

  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema<ICompany> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: String,
    phone: String,
    address: String,

    interestRate: {
      type: Number,
      default: 20, // default system rate
    },

    interestRateLastUpdated: {
      type: Date,
      default: Date.now,
    },

    canChangeInterest: {
      type: Boolean,
      default: true,
    },

    policy: String,
  },
  {
    timestamps: true,
  }
);

export default CompanySchema;
