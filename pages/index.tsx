import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { Tile } from "../components/Tile";
import { useGame } from "../hooks/useGame";
import Select from "@material-ui/core/Select";
import styles from "../styles/Game.module.scss";
import { MenuItem } from "@material-ui/core";
import { GetServerSidePropsResult } from "next";
import { submitResult } from "../utils/submitResult";
import { LeaderboardType } from "../models/Leaderboard";

import { Leaderboard } from "../components/Leaderboard";

interface IGameSettings {
    _id: string;
    name: string;
    delay: number;
    multiplier: number;
    fieldCount: number;
}

interface IndexProps {
    gameSettings: IGameSettings[];
    leaderboard: LeaderboardType[];
}

const Index: React.FC<IndexProps> = ({ gameSettings, leaderboard }) => {
    const [
        selectedGameSettings,
        setSelectedGamesSettings,
    ] = useState<IGameSettings | null>(null);
    const [name, setName] = useState("");

    const [
        leaderboardEntry,
        setLeaderboardEntry,
    ] = useState<LeaderboardType | null>(null);

    const {
        tilesState,
        isGameRunning,
        result,
        tileClicked,
        startGame,
    } = useGame({
        fieldCount: selectedGameSettings?.fieldCount,
        delay: selectedGameSettings?.delay,
    });

    const tiles = useMemo(() => {
        return tilesState.map((state, idx) => (
            <Tile
                key={idx}
                fieldCount={selectedGameSettings?.fieldCount}
                state={state}
                onClick={() => tileClicked(idx)}
            />
        ));
    }, [tilesState]);

    useEffect(() => {
        if (!isGameRunning && result && result.text && result.time) {
            setLeaderboardEntry(null);
            submitResult({
                name,
                time: result.time,
                gameSettingsId: selectedGameSettings!._id,
            }).then((data) => setLeaderboardEntry(data));
        }
    }, [isGameRunning]);

    return (
        <>
            <Head>
                <title>Game In Dots</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.block}>
                    <div className={styles.controlsContainer}>
                        <div className={styles["M_UI-root"]}>
                            <Select
                                name="gameSettings"
                                defaultValue=""
                                classes={{
                                    select: styles["M_UI-select"],
                                }}
                                style={{ width: "100%" }}
                                disableUnderline
                                autoWidth
                                displayEmpty
                                onChange={({ target }) => {
                                    setSelectedGamesSettings(
                                        gameSettings[
                                            parseInt(target.value as string)
                                        ]
                                    );
                                }}
                                disabled={isGameRunning}
                            >
                                <MenuItem value="" disabled>
                                    Pick game mode
                                </MenuItem>
                                {gameSettings.map((item, idx) => (
                                    <MenuItem value={idx} key={idx}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <input
                                className={styles.playerNameInput}
                                disabled={isGameRunning}
                                onChange={({ target }) => setName(target.value)}
                                name="playerName"
                                placeholder="Enter your name"
                            />
                        </div>

                        <button
                            className={styles.startGameButton}
                            onClick={startGame}
                            disabled={
                                isGameRunning || !name || !selectedGameSettings
                            }
                        >
                            {result.text ? "PLAY AGAIN?" : "PLAY"}
                        </button>
                    </div>
                    <div className={styles.gameEndedMessage}>
                        {!isGameRunning && result.text && result.text}
                    </div>
                    <div>
                        <div className={styles.tilesContainer}>{tiles}</div>
                    </div>
                </div>
                <div className={styles.block}>
                    <Leaderboard
                        list={leaderboard}
                        newEntry={leaderboardEntry}
                    />
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps(): Promise<
    GetServerSidePropsResult<IndexProps>
> {
    const getGameSettingsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game-settings`
    );

    const gameSettings: IGameSettings[] = await getGameSettingsResponse.json();

    const getLeaderBoard = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/winners`
    );

    const leaderboard: LeaderboardType[] = await getLeaderBoard.json();

    if (!gameSettings) {
        return {
            notFound: true,
        };
    }

    return {
        props: { gameSettings, leaderboard },
    };
}

export default Index;
