import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";

export class ScheduleController {
    /**
     * @swagger
     * /schedules/loan/{loanId}:
     *   get:
     *     summary: Get schedules for a specific loan
     *     tags: [Schedules]
     *     parameters:
     *       - in: path
     *         name: loanId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of schedules for the loan
     */
    static async getSchedulesByLoanId(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            const schedules = await ScheduleService.getByLoanId(req.params.loanId as string, companyId);
            res.json(schedules);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /schedules/{id}:
     *   patch:
     *     summary: Update schedule status and paid amount
     *     tags: [Schedules]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *               paidAmount:
     *                 type: number
     *     responses:
     *       200:
     *         description: Schedule updated
     */
    static async updateScheduleStatus(req: Request, res: Response) {
        try {
            const { status, paidAmount } = req.body;
            const schedule = await ScheduleService.updateStatus(req.params.id as string, status, paidAmount);
            if (!schedule) return res.status(404).json({ message: "Schedule not found" });
            res.json(schedule);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
