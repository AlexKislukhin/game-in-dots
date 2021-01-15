import { NextApiRequest, NextApiResponse } from "next/types";
import { GameSettings, IGameSettings } from "../../models/GameSettings";

import { dbConnect } from "../../utils/dbConnect";

export default async function gameSettingsHandler(
    _: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    const data: IGameSettings[] = await GameSettings.find({}).sort(
        "fieldCount"
    );

    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
}
