import { GameSettings, GameSettingsType } from "../models/GameSettings";
import { dbConnect } from "./dbConnect";

const defaultGameSettings: GameSettingsType[] = [
    {
        name: "Easy",
        delay: 2000,
        multiplier: 1,
        fieldCount: 3,
    },
    {
        name: "Normal",
        delay: 1000,
        multiplier: 1.25,
        fieldCount: 4,
    },
    {
        name: "Hard",
        delay: 800,
        multiplier: 2,
        fieldCount: 5,
    },
];

const populateGameSettings = async () => {
    try {
        await dbConnect();
    } catch (error) {
        throw new Error(`Couldn't connect to mongodb due to error: ${error}`);
    }

    try {
        const gameSettingsCount = await GameSettings.countDocuments({});

        if (!gameSettingsCount) {
            await GameSettings.insertMany(defaultGameSettings);
        }
    } catch (error) {
        throw new Error(
            `Couldn't insert default game settings due to error: ${error}`
        );
    }

    process.exit();
};

populateGameSettings();
