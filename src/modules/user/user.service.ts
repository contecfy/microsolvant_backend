import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserSchema, { IUser } from "./user.schema";

//
// 🔐 HASH PASSWORD & PIN BEFORE SAVE
//
UserSchema.pre("save", async function () {
    const user = this as IUser;

    // Hash password if modified
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    // Hash pin if exists & modified
    if (user.pin && user.isModified("pin")) {
        user.pin = await bcrypt.hash(user.pin, 10);
    }
});

//
// 🔑 COMPARE PASSWORD
//
UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

//
// 🔢 COMPARE PIN
//
UserSchema.methods.comparePin = async function (pin: string) {
    if (!this.pin) return false;
    return await bcrypt.compare(pin, this.pin);
};

export const User = mongoose.model<IUser>("User", UserSchema);

import { Loan } from "../loan/loan.service";
import { Collateral } from "../collateral/collateral.service";

export class UserService {
    static async getAll() {
        return await User.find();
    }

    static async getById(id: string) {
        return await User.findById(id);
    }

    static async create(data: Partial<IUser>) {
        return await User.create(data);
    }

    static async update(id: string, data: Partial<IUser>) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        return await User.findByIdAndDelete(id);
    }

    static async register(data: any): Promise<any> {
        // Bulk registration support
        if (Array.isArray(data)) {
            return Promise.all(data.map(item => this.register(item)));
        }

        console.log("📝 Registration Attempt:", data);
        
        // Check for existing user by individual unique fields
        const checks = [
            { field: "email", message: "Email already in use" },
            { field: "phone", message: "Phone number already in use" },
            { field: "username", message: "Username already taken" },
            { field: "nationalId", message: "National ID already registered" },
        ];

        for (const check of checks) {
            const value = (data as any)[check.field];
            if (value) {
                console.log(`🔍 Checking ${check.field}: [${value}]`);
                const exists = await User.findOne({ [check.field]: value });
                if (exists) {
                    console.log(`❌ Duplicate found for ${check.field}`);
                    throw new Error(check.message);
                }
            }
        }

        const user = await User.create(data);
        console.log("✅ User Created Successfully");
        
        const token = this.generateToken((user._id as any).toString(), user.company?.toString());
        return { user, token };
    }

    static async registerCompanyWithAdmin(companyData: any, adminData: any): Promise<any> {
        const { CompanyService } = require("../company/company.service");
        
        console.log("🏢 Registering Company + Admin:", companyData.name);
        
        // Start a manual "transaction-like" flow if no real mongo transaction is used, 
        // but for simplicity we'll just create the company first.
        const company = await CompanyService.create(companyData);
        
        adminData.company = company._id;
        adminData.role = "admin";
        
        try {
            const result = await this.register(adminData);
            return { company, ...result };
        } catch (error) {
            // Cleanup company if admin creation fails
            await CompanyService.delete(company._id);
            throw error;
        }
    }

    static async login(id: string, password?: string, pin?: string) {
        const user = await User.findOne({ 
            $or: [{ email: id }, { username: id }, { phone: id }] 
        }).select("+password +pin"); 
        
        if (!user) throw new Error("Invalid credentials");

        if (pin) {
            const isMatch = await bcrypt.compare(pin, user.pin as string);
            if (!isMatch) throw new Error("Invalid PIN");
        } else if (password) {
            const isMatch = await bcrypt.compare(password, user.password as string);
            if (!isMatch) throw new Error("Invalid password");
        } else {
            throw new Error("Password or PIN is required");
        }

        const token = this.generateToken((user._id as any).toString(), user.company?.toString());
        return { user, token };
    }

    private static generateToken(userId: string, companyId?: string) {
        return jwt.sign({ id: userId, companyId }, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });
    }

    static async getEligibility(userId: string) {
        const LoanMod = mongoose.model("Loan");
        const CollateralMod = mongoose.model("Collateral");

        const lastLoan = await LoanMod.findOne({ client: userId, status: "completed" }).sort({ updatedAt: -1 });
        const collateral = await CollateralMod.find({ client: userId, status: "secured" });
        
        const totalCollateralValue = collateral.reduce((sum: any, c: any) => sum + c.value, 0);
        const lastLoanAmount = (lastLoan as any)?.amount || 0;

        const maxLoan = lastLoanAmount > 0 
            ? Math.min(lastLoanAmount * 1.2, totalCollateralValue)
            : totalCollateralValue * 0.5;

        return {
            lastLoanAmount,
            totalCollateralValue,
            suggestedMaxLoan: maxLoan,
            isFirstTime: !lastLoan
        };
    }
}
