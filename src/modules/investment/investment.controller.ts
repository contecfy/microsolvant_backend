import { Request, Response } from "express";
import { InvestmentService } from "./investment.service";

export class InvestmentController {
    /**
     * @swagger
     * /investments:
     *   get:
     *     summary: Get all investments
     *     tags: [Investments]
     *     responses:
     *       200:
     *         description: List of investments
     */
    static async getInvestments(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            const investments = await InvestmentService.getAll(companyId);
            res.json(investments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /investments/{id}:
     *   get:
     *     summary: Get investment by ID
     *     tags: [Investments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Investment found
     */
    static async getInvestmentById(req: Request, res: Response) {
        try {
            const investment = await InvestmentService.getById(req.params.id as string);
            if (!investment) return res.status(404).json({ message: "Investment not found" });
            res.json(investment);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /investments:
     *   post:
     *     summary: Create a new investment
     *     tags: [Investments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Investment'
     *     responses:
     *       201:
     *         description: Investment created
     */
    static async createInvestment(req: Request, res: Response) {
        try {
            const investment = await InvestmentService.create(req.body);
            res.status(201).json(investment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateInvestment(req: Request, res: Response) {
        try {
            const investment = await InvestmentService.update(req.params.id as string, req.body);
            if (!investment) return res.status(404).json({ message: "Investment not found" });
            res.json(investment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteInvestment(req: Request, res: Response) {
        try {
            const investment = await InvestmentService.delete(req.params.id as string);
            if (!investment) return res.status(404).json({ message: "Investment not found" });
            res.json({ message: "Investment deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
