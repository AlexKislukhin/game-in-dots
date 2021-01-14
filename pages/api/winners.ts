import { NextApiRequest, NextApiResponse } from "next/types";
import { GameSettings, IGameSettings } from "../../models/GameSettings";
import { ILeaderboard, Leaderboard } from "../../models/Leaderboard";

import { dbConnect } from "../../utils/dbConnect";

export default async function winnersHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "GET":
            return getWinnersLeaderboard(req, res);
        case "POST":
            return addWinnerToLeaderboard(req, res);
        default:
            res.status(404);
            return res.end("");
    }
}

const getWinnersLeaderboard = async (
    _: NextApiRequest,
    res: NextApiResponse
) => {
    await dbConnect();

    const data: ILeaderboard[] = await Leaderboard.find({}).sort("-date");

    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
};

const addWinnerToLeaderboard = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    await dbConnect();

    const { gameSettingsId, time, name } = req.body;

    if (gameSettingsId && time && name) {
        const gameSettings: IGameSettings = await GameSettings.findOne({
            _id: gameSettingsId,
        });

        if (!gameSettings) {
            return res.status(400).end(JSON.stringify({}));
        }

        const player = await Leaderboard.create({
            name,
            score: (100000 / time) * gameSettings.multiplier,
        });

        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(player));
    } else {
        return res.status(400).end(JSON.stringify({}));
    }
};
