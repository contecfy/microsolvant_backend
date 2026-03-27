import { Request, Response } from "express";
import { RepaymentService } from "./repayment.service";

export class RepaymentController {
    /**
     * @swagger
     * /repayments:
     *   get:
     *     summary: Get all repayments
     *     tags: [Repayments]
     *     responses:
     *       200:
     *         description: List of repayments
     */
    static async getRepayments(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            const repayments = await RepaymentService.getAll(companyId);
            res.json(repayments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /repayments/{id}:
     *   get:
     *     summary: Get repayment by ID
     *     tags: [Repayments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Repayment found
     */
    static async getRepaymentById(req: Request, res: Response) {
        try {
            const repayment = await RepaymentService.getById(req.params.id as string);
            if (!repayment) return res.status(404).json({ message: "Repayment not found" });
            res.json(repayment);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /repayments:
     *   post:
     *     summary: Create a new repayment
     *     tags: [Repayments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Repayment'
     *     responses:
     *       201:
     *         description: Repayment created
     */
    static async createRepayment(req: Request, res: Response) {
        try {
            const repayment = await RepaymentService.create(req.body);
            res.status(201).json(repayment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateRepayment(req: Request, res: Response) {
        try {
            const repayment = await RepaymentService.update(req.params.id as string, req.body);
            if (!repayment) return res.status(404).json({ message: "Repayment not found" });
            res.json(repayment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteRepayment(req: Request, res: Response) {
        try {
            const repayment = await RepaymentService.delete(req.params.id as string);
            if (!repayment) return res.status(404).json({ message: "Repayment not found" });
            res.json({ message: "Repayment deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
