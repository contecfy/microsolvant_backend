import mongoose from "mongoose";
import ReportSchema, { IReport } from "./report.schema";

export const Report = mongoose.model<IReport>("Report", ReportSchema);

export class ReportService {
    static async getAll() {
        return await Report.find().populate("generatedBy");
    }

    static async getById(id: string) {
        return await Report.findById(id).populate("generatedBy");
    }

    static async create(data: Partial<IReport>) {
        return await Report.create(data);
    }

    static async delete(id: string) {
        return await Report.findByIdAndDelete(id);
    }

    // real logic for generating financial summary
    static async generateFinancialSummary() {
        const Loan = mongoose.model("Loan");

        const loanStats = await Loan.aggregate([
            {
                $group: {
                    _id: null,
                    totalLent: { $sum: "$amount" },
                    totalInterestExpected: { $sum: "$interestAmount" },
                    totalRepaid: { $sum: "$totalRepaid" },
                    totalRemaining: { $sum: "$remainingBalance" },
                    activePrincipal: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "ongoing"] }, "$amount", 0]
                        }
                    },
                    ongoingCount: {
                        $sum: { $cond: [{ $eq: ["$status", "ongoing"] }, 1, 0] }
                    },
                    defaultedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "defaulted"] }, 1, 0] }
                    },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = loanStats[0] || {
            totalLent: 0,
            totalInterestExpected: 0,
            totalRepaid: 0,
            totalRemaining: 0,
            activePrincipal: 0,
            ongoingCount: 0,
            defaultedCount: 0,
            completedCount: 0,
            count: 0
        };

        // Total profit is the interest portion of what has been repaid
        // Simplified: (totalRepaid / totalPayable) * interestAmount
        // Since we aggregate total, we use the average ratio or total ratio
        const totalPayable = stats.totalLent + stats.totalInterestExpected;
        const interestRatio = totalPayable > 0 ? stats.totalInterestExpected / totalPayable : 0;
        const totalProfit = stats.totalRepaid * interestRatio;

        const collectionRate = totalPayable > 0 ? (stats.totalRepaid / totalPayable) * 100 : 0;

        return {
            totalLent: stats.totalLent,
            totalRepaid: stats.totalRepaid,
            totalProfit: totalProfit,
            activePortfolio: stats.totalRemaining,
            activePrincipal: stats.activePrincipal,
            collectionRate: parseFloat(collectionRate.toFixed(2)),
            ongoingCount: stats.ongoingCount,
            defaultedCount: stats.defaultedCount,
            completedCount: stats.completedCount,
            totalCount: stats.count,
            timestamp: new Date()
        };
    }
}
