import mongoose from "mongoose";

import { config } from "dotenv";

config();

export async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    return mongoose.connect(process.env.MONGODB_URI || "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
}
