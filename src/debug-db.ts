import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
}

console.log(`Connecting to: ${uri.replace(/:([^:@]+)@/, ":****@")}`); // Mask password

mongoose.connect(uri)
    .then(() => {
        console.log("✅ Connection SUCCESSFUL!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Connection FAILED!");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.reason) {
            console.error("Error Reason:", JSON.stringify(err.reason, null, 2));
        }
        process.exit(1);
    });
