import React, { useEffect, useState } from "react";

import styles from "../styles/Tile.module.scss";

export type TileState =
    | "inactive"
    | "active"
    | "playersPoint"
    | "computersPoint";

interface TileProps {
    fieldCount?: number;
    state: TileState;
    onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({
    fieldCount = 3,
    state = "inactive",
    onClick,
}) => {
    const [color, setColor] = useState("white");

    useEffect(() => {
        switch (state) {
            case "active":
                setColor("#42d8e8");
                break;
            case "playersPoint":
                setColor("#00e871");
                break;
            case "computersPoint":
                setColor("#e85a5f");
                break;
            default:
                setColor("white");
                break;
        }
    }, [state]);

    return (
        <div
            onClick={onClick}
            className={styles.tile}
            style={{
                width: `${100 / fieldCount}%`,
                paddingBottom: `calc(${100 / fieldCount}% - 4px)`,
                backgroundColor: color,
            }}
        />
    );
};
