import { useEffect, useRef, useState } from "react";
import { TileState } from "../components/Tile";
import { shuffleArray } from "../utils/shuffleArray";

interface useGameParams {
    fieldCount?: number;
    delay?: number;
}

const generateTilesState = (fieldCount: number) => {
    const result: TileState[] = [];

    for (let i = 0; i < fieldCount ** 2; i++) {
        result.push("inactive");
    }

    return result;
};

export const useGame = ({ fieldCount = 3, delay = 2000 }: useGameParams) => {
    const [isGameRunning, setIsGameRunning] = useState(false);

    const [tilesState, setTilesState] = useState<TileState[]>(() =>
        generateTilesState(fieldCount)
    );

    const gameStartedRef = useRef(0);

    const sequenceRef = useRef<number[]>([]);
    const tileIdx = useRef<number>(-1);

    const playerScore = useRef(0);
    const computerScore = useRef(0);

    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const [result, setResult] = useState<{ text: string; time: number }>({
        text: "",
        time: 0,
    });

    const clearTimer = () => {
        const { current } = timerRef;
        if (current) {
            clearTimeout(current);
        }
    };

    const activateTile = (idx?: number, newState?: TileState) => {
        if (isGameRunning) {
            setTilesState((c) => {
                tileIdx.current++;

                const newTilesState = [...c];

                if (typeof idx === "number" && newState) {
                    newTilesState[idx] = newState;
                }

                const needToWin = Math.ceil(fieldCount ** 2 / 2);

                if (
                    playerScore.current >= needToWin ||
                    computerScore.current >= needToWin
                ) {
                    gameEnded(playerScore.current > computerScore.current);
                    return newTilesState;
                }

                newTilesState[sequenceRef.current[tileIdx.current]] = "active";

                timerRef.current = setTimeout(() => {
                    tileExpired();
                }, delay);

                return newTilesState;
            });
        }
    };

    const tileClicked = (idx: number) => {
        if (tilesState[idx] === "active" && isGameRunning) {
            clearTimer();
            playerScore.current++;
            activateTile(idx, "playersPoint");
        }
    };

    const tileExpired = () => {
        clearTimer();
        computerScore.current++;
        activateTile(sequenceRef.current[tileIdx.current], "computersPoint");
    };

    useEffect(() => {
        if (isGameRunning) {
            const arr: number[] = [];

            for (let i = 0; i < fieldCount ** 2; i++) {
                arr.push(i);
            }

            sequenceRef.current = shuffleArray(arr);

            playerScore.current = 0;
            computerScore.current = 0;
            tileIdx.current = -1;

            setTilesState(generateTilesState(fieldCount));

            gameStartedRef.current = Date.now();

            activateTile();
        } else {
            clearTimer();
        }

        return () => clearTimer();
    }, [isGameRunning]);

    useEffect(() => {
        setTilesState(generateTilesState(fieldCount));
    }, [fieldCount]);

    const gameEnded = (playerWon: boolean) => {
        const gameTime = Date.now() - gameStartedRef.current;

        if (playerWon) {
            setResult({ text: "Player won!", time: gameTime });
        } else {
            setResult({ text: "Computer won!", time: gameTime });
        }

        setIsGameRunning(false);
    };

    return {
        tilesState,
        isGameRunning,
        result,
        tileClicked,
        startGame: () => setIsGameRunning(true),
    };
};
