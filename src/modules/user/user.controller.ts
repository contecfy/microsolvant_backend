import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: List of users
     */
    static async getUsers(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            const users = await UserService.getAll(companyId);
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User found
     *       404:
     *         description: User not found
     */
    static async getUserById(req: Request, res: Response) {
        try {
            const user = await UserService.getById(req.params.id as string);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: User created
     */
    static async createUser(req: Request, res: Response) {
        try {
            const result = await UserService.register(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Login user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *                 description: "Phone Number, Email, or Username"
     *               email:
     *                 type: string
     *                 description: "Optional: Login with Email"
     *               phone:
     *                 type: string
     *                 description: "Optional: Login with Phone"
     *               username:
     *                 type: string
     *                 description: "Optional: Login with Username"
     *               password:
     *                 type: string
     *                 description: "Required if logging in with Password"
     *               pin:
     *                 type: string
     *                 description: "Required if logging in with PIN (Phone only)"
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     */
    static async login(req: Request, res: Response) {
        try {
            const { id, email, phone, username, password, pin } = req.body;
            const identifier = id || email || phone || username;

            if (!identifier) {
                return res.status(400).json({ message: "Email, Phone, or Username is required" });
            }

            const result = await UserService.login(identifier, password, pin);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const user = await UserService.update(req.params.id as string, req.body);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const user = await UserService.delete(req.params.id as string);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json({ message: "User deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * @swagger
     * /users/logout:
     *   post:
     *     summary: Logout user
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logged out successfully
     *       401:
     *         description: Not authorized
     */
    static async logout(req: Request, res: Response) {
        try {
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users/{id}/eligibility:
     *   get:
     *     summary: Check user loan eligibility
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Eligibility data
     */
    static async getEligibility(req: Request, res: Response) {
        try {
            const eligibility = await UserService.getEligibility(req.params.id as string);
            res.json(eligibility);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users/register-company:
     *   post:
     *     summary: Register a new company and its first admin
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               company:
     *                 $ref: '#/components/schemas/Company'
     *               admin:
     *                 $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: Company and Admin created
     */
    static async registerCompany(req: Request, res: Response) {
        try {
            const { company, admin, workers } = req.body;
            const result = await UserService.registerCompanyWithWorkers(company, admin, workers || []);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users/search/{nationalId}:
     *   get:
     *     summary: Search user globally by National ID (Staff Only)
     *     tags: [Users]
     */
    static async searchGlobally(req: Request, res: Response) {
        try {
            const user = await UserService.searchByNationalId(req.params.nationalId as string);
            if (!user) return res.status(404).json({ message: "No user found with this National ID" });
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @swagger
     * /users/{id}/link:
     *   post:
     *     summary: Link existing user to current company (Staff Only)
     *     tags: [Users]
     */
    static async linkToCompany(req: Request, res: Response) {
        try {
            const companyId = (req as any).user?.currentCompany;
            if (!companyId) throw new Error("No active company context");
            
            const user = await UserService.linkToCompany(req.params.id as string, companyId);
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
