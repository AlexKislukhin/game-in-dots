import { Server, Socket } from "socket.io";
import { NextApiHandler, NextApiResponse } from "next";
import { LeaderboardType } from "../../models/Leaderboard";

export type LeaderboardSocketEvents =
    | "newLeaderboardEntry"
    | "updateLeaderboard";

interface ILeaderboardSocket extends Socket {
    on(event: LeaderboardSocketEvents, callback: (data: any) => void): this;
    emit(event: LeaderboardSocketEvents, data: any): boolean;
}

interface TypeUnfriendlyResponse extends NextApiResponse {
    socket: any;
}

const ioHandler = async (_: NextApiHandler, res: TypeUnfriendlyResponse) => {
    // Hot reload doesn't update socket
    // res.socket.server.io = "";

    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        io.on("connection", (socket: ILeaderboardSocket) => {
            socket.on("newLeaderboardEntry", (data: LeaderboardType) => {
                io.emit("updateLeaderboard", data);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default ioHandler;
