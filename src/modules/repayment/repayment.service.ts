import mongoose from "mongoose";
import RepaymentSchema, { IRepayment } from "./repayment.schema";

//
// 🧠 AFTER PAYMENT → UPDATE LOAN
//
RepaymentSchema.post("save", async function (doc) {
    const Loan = mongoose.model("Loan");
    const Schedule = mongoose.model("Schedule");

    const loan = await Loan.findById(doc.loan);
    if (!loan) return;

    // 1. Update Loan totals
    const amountPaid = doc.amount;
    loan.totalRepaid += amountPaid;
    loan.remainingBalance = (loan as any).totalPayable - loan.totalRepaid;

    if (loan.remainingBalance <= 0) {
        loan.status = "completed";
        loan.remainingBalance = 0;
    } else {
        loan.status = "ongoing";
    }

    await loan.save();

    // 2. Update Schedules (Waterfall logic)
    // Find all pending/missed schedules for this loan
    const schedules = await Schedule.find({
        loan: doc.loan,
        status: { $in: ["pending", "missed", "partially_paid"] },
    }).sort({ dueDate: 1 });

    let remainingPayment = amountPaid;

    for (const schedule of schedules) {
        if (remainingPayment <= 0) break;

        const needed = schedule.expectedAmount - schedule.paidAmount;

        if (remainingPayment >= needed) {
            // Fully pay this schedule
            remainingPayment -= needed;
            schedule.paidAmount = schedule.expectedAmount;
            schedule.status = "paid";
        } else {
            // Partially pay this schedule
            schedule.paidAmount += remainingPayment;
            schedule.status = "partially_paid";
            remainingPayment = 0;
        }

        await (schedule as any).save();
    }
});

export const Repayment = mongoose.model<IRepayment>("Repayment", RepaymentSchema);

export class RepaymentService {
    static async getAll(companyId?: string) {
        const query = companyId ? { company: companyId } : {};
        return await Repayment.find(query).populate("loan client");
    }

    static async getById(id: string) {
        return await Repayment.findById(id).populate("loan client");
    }

    static async create(data: Partial<IRepayment>) {
        return await Repayment.create(data);
    }

    static async update(id: string, data: Partial<IRepayment>) {
        return await Repayment.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        return await Repayment.findByIdAndDelete(id);
    }
}
