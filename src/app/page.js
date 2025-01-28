"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "antd";
import styles from "./page.module.css";
import { Fade } from "react-bootstrap";
import Navigation from "./components/Navigation";
import * as Icon from "react-bootstrap-icons";
import { useRouter } from 'next/navigation';
import { getStorageItem } from "./utilities/LocalStorage";
import { useTheme } from "./utilities/ThemeContext";

const Home = ({ }) =>
{
    const router = useRouter();
    // const [theme, set_theme] = useState('light');
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

                    <div className={styles.leftContainer}>
                        <div className={styles.logo}>
                            <img src={`/image/rthk_logo.png`} style={{ width: '100%', height: '100%' }} />
                        </div>

                        <div className={styles.header1}> 香港電台節目重溫 </div>

                        <div className={styles.header2}> 此網站內容均來自 rthk.hk </div>
                    </div>


                    <div className={styles.rightContainer}>
                        <IconButton
                            router={router}
                            navigateTo={'pages/selectProgram'}
                            icon={(<Icon.Broadcast size={30} className={styles.btnIcon} />)}
                            text={'選擇節目'}
                        />

                        <IconButton
                            router={router}
                            navigateTo={'pages/bookmark'}
                            icon={(<Icon.Bookmark size={30} className={styles.btnIcon} />)}
                            text={'收藏節目'}
                        />
                    </div>

                </div>
            </Fade>
        </div>
    )
}

export default Home;

const IconButton = ({ router, navigateTo, icon, text }) =>
{
    return (
        <div className={styles.btnContainer} onClick={() => { router.push(`/${navigateTo}`) }}>
            {icon}
            <div className={styles.btnText}>
                {text}
            </div>
        </div>
    )
}
