import { Request, Response } from "express";
import { CollateralService } from "./collateral.service";

export class CollateralController {
    /**
     * @swagger
     * /collateral:
     *   get:
     *     summary: Get all collateral
     *     tags: [Collateral]
     *     responses:
     *       200:
     *         description: List of collateral
     */
    static async getCollaterals(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            const collaterals = await CollateralService.getAll(companyId);
            res.json(collaterals);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /collateral/{id}:
     *   get:
     *     summary: Get collateral by ID
     *     tags: [Collateral]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Collateral found
     */
    static async getCollateralById(req: Request, res: Response) {
        try {
            const collateral = await CollateralService.getById(req.params.id as string);
            if (!collateral) return res.status(404).json({ message: "Collateral not found" });
            res.json(collateral);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /collateral:
     *   post:
     *     summary: Create a new collateral
     *     tags: [Collateral]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Collateral'
     *     responses:
     *       201:
     *         description: Collateral created
     */
    static async createCollateral(req: Request, res: Response) {
        try {
            const collateral = await CollateralService.create(req.body);
            res.status(201).json(collateral);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateCollateral(req: Request, res: Response) {
        try {
            const collateral = await CollateralService.update(req.params.id as string, req.body);
            if (!collateral) return res.status(404).json({ message: "Collateral not found" });
            res.json(collateral);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteCollateral(req: Request, res: Response) {
        try {
            const collateral = await CollateralService.delete(req.params.id as string);
            if (!collateral) return res.status(404).json({ message: "Collateral not found" });
            res.json({ message: "Collateral deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
