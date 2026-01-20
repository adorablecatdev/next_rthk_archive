"use client"

import { useEffect, useState } from "react";
import styles from "./not-found.module.css";
import { Fade } from "react-bootstrap";
import Navigation from "./components/Navigation";
import { useTheme } from "./utilities/ThemeContext";

const NotFound = ({ }) =>
{
    const [showContent, set_showContent] = useState(false);

    const { theme, toggleTheme } = useTheme();

    useEffect(() =>
    {
        initialize();
    }, [])

    async function initialize()
    {
        set_showContent(true);
    }

    return (
        <div data-theme={theme} className={styles.container}>
            <Navigation currentLocation={'home'} theme={theme} toggleTheme={toggleTheme} />
            <Fade in={showContent}>
                <div className={styles.contentContainer}>

                    <div className={styles.logo}>
                        <img src={`/image/error.png`} style={{ width: '100%', height: '100%' }} />
                    </div>

                    <div className={styles.header1}> 找不到相關頁面 </div>
                </div>
            </Fade>
        </div>
    )
}

export default NotFound;
