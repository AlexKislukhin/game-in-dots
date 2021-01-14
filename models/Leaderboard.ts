import mongoose, { Schema, Document } from "mongoose";

export interface ILeaderboard extends Document {
    name: string;
    date: Date;
    score: number;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
    name: {
        required: true,
        type: String,
    },
    score: {
        required: true,
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const Leaderboard =
    mongoose.models.Leaderboard ||
    mongoose.model("Leaderboard", LeaderboardSchema);
