import Head from "next/head";

import styles from "../styles/Game.module.scss";

export default function Index() {
    return (
        <>
            <Head>
                <title>Game In Dots</title>
            </Head>
            <div className={styles.hello}>Hello world</div>
        </>
    );
}
