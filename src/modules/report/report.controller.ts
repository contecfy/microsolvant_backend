import { Request, Response } from "express";
import { ReportService } from "./report.service";

export class ReportController {
    /**
     * @swagger
     * /reports:
     *   get:
     *     summary: Get all reports
     *     tags: [Reports]
     *     responses:
     *       200:
     *         description: List of reports
     */
    static async getReports(req: Request, res: Response) {
        try {
            const reports = await ReportService.getAll();
            res.json(reports);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /reports/{id}:
     *   get:
     *     summary: Get report by ID
     *     tags: [Reports]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Report found
     */
    static async getReportById(req: Request, res: Response) {
        try {
            const report = await ReportService.getById(req.params.id as string);
            if (!report) return res.status(404).json({ message: "Report not found" });
            res.json(report);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /reports:
     *   post:
     *     summary: Create a new report
     *     tags: [Reports]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Report'
     *     responses:
     *       201:
     *         description: Report created
     */
    static async createReport(req: Request, res: Response) {
        try {
            const report = await ReportService.create(req.body);
            res.status(201).json(report);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /reports/generate/financial:
     *   get:
     *     summary: Generate real-time financial summary
     *     tags: [Reports]
     *     responses:
     *       200:
     *         description: Financial summary data
     */
    static async generateSummary(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            if (!companyId) throw new Error("Company context required");
            const summary = await ReportService.generateFinancialSummary(companyId);
            res.json(summary);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /reports/{id}:
     *   delete:
     *     summary: Delete a report
     *     tags: [Reports]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Report deleted
     */
    static async deleteReport(req: Request, res: Response) {
        try {
            const report = await ReportService.delete(req.params.id as string);
            if (!report) return res.status(404).json({ message: "Report not found" });
            res.json({ message: "Report deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
