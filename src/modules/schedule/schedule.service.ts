import mongoose from "mongoose";
import ScheduleSchema, { ISchedule } from "./schedule.schema";

export const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export class ScheduleService {
    static async create(data: Partial<ISchedule>) {
        return await Schedule.create(data);
    }

    static async getByLoanId(loanId: string, companyId?: string) {
        const query = companyId ? { loan: loanId, company: companyId } : { loan: loanId };
        return await Schedule.find(query).sort({ dueDate: 1 });
    }

    static async updateStatus(id: string, status: string, paidAmount?: number) {
        const update: any = { status };
        if (paidAmount !== undefined) {
            update.paidAmount = paidAmount;
        }
        return await Schedule.findByIdAndUpdate(id, update, { new: true });
    }

    /**
     * Helper to generate a repayment schedule based on loan details
     */
    static async generateSchedule(
        loanId: string, 
        totalPayable: number, 
        durationDays: number, 
        startDate: Date,
        frequency: "daily" | "weekly" | "biweekly" = "daily"
    ) {
        let interval = 1;
        if (frequency === "weekly") interval = 7;
        if (frequency === "biweekly") interval = 14;

        const installmentCount = Math.floor(durationDays / interval);
        const installmentAmount = totalPayable / installmentCount;

        const schedules = [];
        for (let i = 1; i <= installmentCount; i++) {
            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + (i * interval));

            schedules.push({
                loan: loanId,
                dueDate,
                expectedAmount: installmentAmount,
                status: "pending",
            });
        }

        return await Schedule.insertMany(schedules);
    }
}
