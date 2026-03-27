import mongoose from "mongoose";
import LoanSchema, { ILoan } from "./loan.schema";

//
// 🧠 AUTO CALCULATIONS BEFORE SAVE
//
LoanSchema.pre("save", async function () {
    const loan = this as ILoan;

    // Calculate interest amount
    loan.interestAmount = (loan.amount * loan.interestRate) / 100;

    // Total payable
    loan.totalPayable = loan.amount + loan.interestAmount;

    // Remaining balance
    if (!loan.remainingBalance) {
        loan.remainingBalance = loan.totalPayable;
    }

    // Auto set due date if start date exists
    if (loan.startDate && loan.durationDays) {
        const due = new Date(loan.startDate);
        due.setDate(due.getDate() + loan.durationDays);
        loan.dueDate = due;
    }
});

import { ScheduleService } from "../schedule/schedule.service";

export const Loan = mongoose.model<ILoan>("Loan", LoanSchema);

export class LoanService {
    static async getAll(companyId?: string) {
        const query = companyId ? { company: companyId } : {};
        return await Loan.find(query).populate("client");
    }

    static async getById(id: string) {
        return await Loan.findById(id).populate("client");
    }

    static async create(data: any): Promise<any> {
        // Bulk creation support
        if (Array.isArray(data)) {
            return Promise.all(data.map(item => this.create(item)));
        }

        const amount = data.amount || 0;
        const interestRate = data.interestRate || 0;
        
        const interestAmount = (amount * interestRate) / 100;
        const totalPayable = amount + interestAmount;
        
        data.interestAmount = interestAmount;
        data.totalPayable = totalPayable;
        data.remainingBalance = totalPayable;
        data.totalRepaid = 0;
        data.status = "ongoing"; 
        data.riskStatus = "green";

        const loan = await Loan.create(data);

        // Auto-generate schedule
        if (loan.startDate && loan.durationDays) {
            await ScheduleService.generateSchedule(
                (loan._id as any).toString(),
                loan.totalPayable,
                loan.durationDays,
                loan.startDate,
                loan.repaymentFrequency
            );
        }

        return loan;
    }

    static async updateStatus(id: string, status: string) {
        const update: any = { status };
        
        // If loan becomes ongoing, set start date if not set
        if (status === "ongoing") {
            const loan = await Loan.findById(id);
            if (loan && !loan.startDate) {
                update.startDate = new Date();
                // Also generate schedule if it doesn't exist
                await ScheduleService.generateSchedule(
                    id,
                    loan.totalPayable,
                    loan.durationDays,
                    update.startDate,
                    loan.repaymentFrequency
                );
            }
        }
        
        return await Loan.findByIdAndUpdate(id, update, { new: true });
    }

    static async applyPenalty(id: string) {
        const loan = await Loan.findById(id);
        if (!loan || loan.isPenaltyApplied) return loan;

        const penalty = loan.remainingBalance * 0.20; // 20% penalty
        
        return await Loan.findByIdAndUpdate(id, {
            $inc: { 
                remainingBalance: penalty,
                totalPayable: penalty,
                penaltyAmount: penalty 
            },
            isPenaltyApplied: true,
            riskStatus: "red"
        }, { new: true });
    }

    static async update(id: string, data: Partial<ILoan>) {
        return await Loan.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        return await Loan.findByIdAndDelete(id);
    }
}
