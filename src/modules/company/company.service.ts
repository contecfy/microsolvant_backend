import mongoose from "mongoose";
import CompanySchema, { ICompany } from "./company.schema";

export const Company = mongoose.model<ICompany>("Company", CompanySchema);

export class CompanyService {
    static async getAll() {
        return await Company.find();
    }

    static async getById(id: string) {
        return await Company.findById(id);
    }

    static async create(data: Partial<ICompany>) {
        return await Company.create(data);
    }

    static async update(id: string, data: Partial<ICompany>) {
        return await Company.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        return await Company.findByIdAndDelete(id);
    }

    /**
     * Specialized logic to update interest rate with 30-day restriction
     */
    static async updateInterestRate(id: string, newRate: number) {
        const company = await Company.findById(id);
        if (!company) throw new Error("Company not found");

        const now = new Date();
        const lastUpdated = company.interestRateLastUpdated;

        if (lastUpdated) {
            const diffDays = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays < 30) {
                const remaining = Math.ceil(30 - diffDays);
                throw new Error(`Interest rate can only be changed after 30 days. Please wait ${remaining} more days.`);
            }
        }

        company.interestRate = newRate;
        company.interestRateLastUpdated = now;
        return await company.save();
    }
}
