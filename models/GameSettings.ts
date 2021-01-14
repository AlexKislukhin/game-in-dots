import mongoose, { Schema, Document } from "mongoose";

export type GameSettingsType = {
    name: string;
    fieldCount: number;
    delay: number;
    multiplier: number;
};

export interface IGameSettings extends Document {
    name: string;
    fieldCount: number;
    delay: number;
    multiplier: number;
}

const GameSettingsSchema = new Schema<IGameSettings>({
    name: {
        required: true,
        type: String,
    },
    fieldCount: {
        required: true,
        type: Number,
    },
    delay: {
        required: true,
        type: Number,
    },
    multiplier: {
        required: true,
        type: Number,
    },
});

export const GameSettings =
    mongoose.models.GameSettings ||
    mongoose.model("GameSettings", GameSettingsSchema);
