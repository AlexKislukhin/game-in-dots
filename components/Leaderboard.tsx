import React, { useEffect, useState } from "react";
import styles from "../styles/Leaderboard.module.scss";
import { timestampToDateString } from "../utils/timestampToDateString";
import io from "socket.io-client";
import { LeaderboardType } from "../models/Leaderboard";

interface LeaderboardProps {
    newEntry: LeaderboardType | null;
    list: LeaderboardType[];
}
export const Leaderboard: React.FC<LeaderboardProps> = ({ list, newEntry }) => {
    const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

    const [leaderboardList, setLeaderboardList] = useState(list);

    useEffect(() => {
        fetch("/api/socketio").finally(() => {
            const s = io(process.env.NEXT_PUBLIC_API_URL!, {
                transports: ["websocket"],
            });

            s.on("updateLeaderboard", (data: LeaderboardType) => {
                setLeaderboardList((oldList) => {
                    const newList = [...oldList];

                    if (newList.length === 8) {
                        newList.pop();
                    }

                    newList.unshift(data);

                    return newList;
                });
            });

            setSocket(s);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (newEntry && socket) {
            socket.emit("newLeaderboardEntry", newEntry);
        }
    }, [newEntry, socket]);

    return (
        <div key="LeaderboardContainer" className={styles.container}>
            <div key={"title"} className={styles.title}>
                Leaderboard
            </div>
            {!leaderboardList.length && (
                <div className={styles.noEntries}>No entries yet</div>
            )}
            {leaderboardList.map((item) => {
                return (
                    <div key={item._id} className={styles.entryContainer}>
                        <span>{item.name}</span>
                        <span>{timestampToDateString(item.date)}</span>
                        <div className={styles.score}>
                            Score: {item.score.toFixed(0)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
