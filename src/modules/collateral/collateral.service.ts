import mongoose from "mongoose";
import CollateralSchema, { ICollateral } from "./collateral.schema";

export const Collateral = mongoose.model<ICollateral>("Collateral", CollateralSchema);

export class CollateralService {
    static async getAll(companyId?: string) {
        const query = companyId ? { company: companyId } : {};
        return await Collateral.find(query).populate("loan client");
    }

    static async getById(id: string) {
        return await Collateral.findById(id).populate("loan client");
    }

    static async create(data: Partial<ICollateral>) {
        return await Collateral.create(data);
    }

    static async update(id: string, data: Partial<ICollateral>) {
        return await Collateral.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        return await Collateral.findByIdAndDelete(id);
    }
}
