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

    static async register(data: Partial<IUser>) {
        const existingUser = await User.findOne({ 
            $or: [{ email: data.email }, { username: data.username }, { phone: data.phone }] 
        });
        if (existingUser) throw new Error("User already exists with this email, username, or phone");

        const user = await User.create(data);
        const token = this.generateToken((user._id as any).toString());
        return { user, token };
    }

    static async login(id: string, password?: string, pin?: string) {
        const user = await User.findOne({ 
            $or: [{ email: id }, { username: id }, { phone: id }] 
        }).select("+password +pin"); 
        
        if (!user) throw new Error("Invalid credentials");

        if (pin) {
            const isMatch = await (user as any).comparePin(pin);
            if (!isMatch) throw new Error("Invalid credentials");
        } else if (password) {
            const isMatch = await (user as any).comparePassword(password);
            if (!isMatch) throw new Error("Invalid credentials");
        } else {
            throw new Error("Password or PIN is required");
        }

        const token = this.generateToken((user._id as any).toString());
        return { user, token };
    }

    private static generateToken(userId: string) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });
    }
}
