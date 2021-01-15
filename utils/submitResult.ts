import { LeaderboardType } from "../models/Leaderboard";

interface ISubmitResult {
    name: string;
    time: number;
    gameSettingsId: string;
}

export const submitResult = async (data: ISubmitResult) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/winners`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" },
    });

    const json: LeaderboardType = await res.json();

    return json;
};
