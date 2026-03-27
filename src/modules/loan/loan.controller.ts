import { Request, Response } from "express";
import { LoanService } from "./loan.service";

export class LoanController {
    /**
     * @swagger
     * /loans:
     *   get:
     *     summary: Get all loans
     *     tags: [Loans]
     *     responses:
     *       200:
     *         description: List of loans
     */
    static async getLoans(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            const loans = await LoanService.getAll(companyId);
            res.json(loans);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /loans/{id}:
     *   get:
     *     summary: Get loan by ID
     *     tags: [Loans]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Loan found
     */
    static async getLoanById(req: Request, res: Response) {
        try {
            const loan = await LoanService.getById(req.params.id as string);
            if (!loan) return res.status(404).json({ message: "Loan not found" });
            res.json(loan);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /loans:
     *   post:
     *     summary: Create a new loan
     *     tags: [Loans]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Loan'
     *     responses:
     *       201:
     *         description: Loan created
     *     security:
     *       - bearerAuth: []
     */
    static async createLoan(req: Request, res: Response) {
        try {
            const loan = await LoanService.create(req.body);
            res.status(201).json(loan);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /loans/{id}:
     *   put:
     *     summary: Update a loan
     *     tags: [Loans]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Loan'
     *     responses:
     *       200:
     *         description: Loan updated
     *     security:
     *       - bearerAuth: []
     */
    static async updateLoan(req: Request, res: Response) {
        try {
            const loan = await LoanService.update(req.params.id as string, req.body);
            if (!loan) return res.status(404).json({ message: "Loan not found" });
            res.json(loan);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /loans/{id}:
     *   delete:
     *     summary: Delete a loan
     *     tags: [Loans]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Loan deleted
     *     security:
     *       - bearerAuth: []
     */
    static async deleteLoan(req: Request, res: Response) {
        try {
            const loan = await LoanService.delete(req.params.id as string);
            if (!loan) return res.status(404).json({ message: "Loan not found" });
            res.json({ message: "Loan deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /loans/{id}/approve:
     *   patch:
     *     summary: Approve a loan
     *     tags: [Loans]
     *     responses:
     *       200:
     *         description: Loan approved
     *     security:
     *       - bearerAuth: []
     */
    static async approveLoan(req: Request, res: Response) {
        try {
            const loan = await LoanService.updateStatus(req.params.id as string, "ongoing");
            if (!loan) return res.status(404).json({ message: "Loan not found" });
            res.json(loan);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /loans/{id}/penalty:
     *   post:
     *     summary: Apply a 20% penalty to a loan
     *     tags: [Loans]
     *     responses:
     *       200:
     *         description: Penalty applied
     *     security:
     *       - bearerAuth: []
     */
    static async applyPenalty(req: Request, res: Response) {
        try {
            const loan = await LoanService.applyPenalty(req.params.id as string);
            if (!loan) return res.status(404).json({ message: "Loan not found" });
            res.json(loan);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
