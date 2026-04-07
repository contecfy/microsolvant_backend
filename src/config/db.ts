import mongoose from "mongoose";
import config from "./index";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        console.log(`MongoDB connected ✅: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        
        if (error.message.includes("ETIMEOUT") || error.message.includes("Could not connect to any servers")) {
            console.error("\n[TIP] This error often occurs when your IP address is not whitelisted in MongoDB Atlas.");
            console.error(`[TIP] Your current IP address is: 197.239.7.24`);
            console.error("[TIP] Please ensure this IP is added to the Network Access list in your Atlas dashboard.\n");
        }
        
        process.exit(1);
    }
};

export default connectDB;
