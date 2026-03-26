import { Request, Response } from "express";
import { CompanyService } from "./company.service";

export class CompanyController {
    /**
     * @swagger
     * /companies:
     *   get:
     *     summary: Get all companies
     *     tags: [Companies]
     *     responses:
     *       200:
     *         description: List of companies
     */
    static async getCompanies(req: Request, res: Response) {
        try {
            const companies = await CompanyService.getAll();
            res.json(companies);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /companies/{id}:
     *   get:
     *     summary: Get company by ID
     *     tags: [Companies]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Company found
     */
    static async getCompanyById(req: Request, res: Response) {
        try {
            const company = await CompanyService.getById(req.params.id as string);
            if (!company) return res.status(404).json({ message: "Company not found" });
            res.json(company);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /companies:
     *   post:
     *     summary: Create a new company
     *     tags: [Companies]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Company'
     *     responses:
     *       201:
     *         description: Company created
     */
    static async createCompany(req: Request, res: Response) {
        try {
            const company = await CompanyService.create(req.body);
            res.status(201).json(company);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /companies/{id}/interest:
     *   patch:
     *     summary: Update company interest rate (Subject to 30-day rule)
     *     tags: [Companies]
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
     *             type: object
     *             properties:
     *               interestRate:
     *                 type: number
     *     responses:
     *       200:
     *         description: Interest rate updated
     */
    static async updateInterestRate(req: Request, res: Response) {
        try {
            const { interestRate } = req.body;
            const company = await CompanyService.updateInterestRate(req.params.id as string, interestRate);
            res.json(company);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /companies/{id}:
     *   delete:
     *     summary: Delete a company
     *     tags: [Companies]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Company deleted
     */
    static async deleteCompany(req: Request, res: Response) {
        try {
            const company = await CompanyService.delete(req.params.id as string);
            if (!company) return res.status(404).json({ message: "Company not found" });
            res.json({ message: "Company deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
