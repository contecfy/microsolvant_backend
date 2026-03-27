import mongoose from "mongoose";
import InvestmentSchema, { IInvestment } from "./investment.schema";

//
// 🧠 AUTO CALCULATE EXPECTED RETURN
//
InvestmentSchema.pre("save", async function () {
    const investment = this as IInvestment;

    const loan = await mongoose.model("Loan").findById(investment.loan);

    if (!loan) {
        throw new Error("Loan not found");
    }

    const investorShare = investment.amount / loan.amount;
    investment.expectedReturn = investorShare * loan.interestAmount;
});

export const Investment = mongoose.model<IInvestment>("Investment", InvestmentSchema);

export class InvestmentService {
    static async getAll(companyId?: string) {
        const query = companyId ? { company: companyId } : {};
        return await Investment.find(query).populate("investor loan");
    }

    static async getById(id: string) {
        return await Investment.findById(id).populate("investor loan");
    }

    static async create(data: Partial<IInvestment>) {
        const Loan = mongoose.model("Loan");
        const loan = await Loan.findById(data.loan);

        if (!loan) throw new Error("Loan not found");
        if (loan.status !== "pending" && loan.status !== "approved") {
            throw new Error("Cannot invest in a loan that is already ongoing or completed");
        }

        // Check if total investments exceed loan amount
        const totalInvested = await Investment.aggregate([
            { $match: { loan: new mongoose.Types.ObjectId(data.loan as any) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const currentTotal = totalInvested.length > 0 ? totalInvested[0].total : 0;
        if (currentTotal + (data.amount || 0) > loan.amount) {
            throw new Error("Investment amount exceeds the required loan amount");
        }

        return await Investment.create(data);
    }

    static async update(id: string, data: Partial<IInvestment>) {
        return await Investment.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        return await Investment.findByIdAndDelete(id);
    }
}
