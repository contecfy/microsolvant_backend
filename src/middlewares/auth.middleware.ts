import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.service";

export interface AuthRequest extends Request {
    user?: any;
    currentCompany?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

            const user = await User.findById(decoded.id).select("-password -pin");

            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            // Extract active company from header or token
            const headerCompanyId = req.headers["x-company-id"] as string;
            const contextCompanyId = headerCompanyId || decoded.companyId;

            // Verify user belongs to this company
            if (contextCompanyId) {
                const isMember = user.companies.some(id => id.toString() === contextCompanyId);
                if (!isMember) {
                    return res.status(403).json({ message: "Access denied to this company" });
                }
                (user as any).currentCompany = contextCompanyId;
            } else if (user.companies.length > 0) {
                // Default to first company if none specified
                (user as any).currentCompany = user.companies[0].toString();
            }

            req.user = user;

            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};

export const staffOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    const staffRoles = ["admin", "loan_officer", "manager", "collector", "compliance", "super_admin"];
    if (req.user && staffRoles.includes(req.user.role)) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Staff only." });
    }
};
