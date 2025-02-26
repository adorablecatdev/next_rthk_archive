"use client"

import Loading from "@/app/components/Loading";
import Navigation from "@/app/components/Navigation";
import { useTheme } from "@/app/utilities/ThemeContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Fade } from "react-bootstrap";
import styles from './style.module.css';

const Instruction = ({ }) =>
{
    const router = useRouter();
    const searchParams = useSearchParams();

    const { theme, toggleTheme } = useTheme();
    const [showContent, set_showContent] = useState(false);
    const [showLoading, set_showLoading] = useState(false);

    useEffect(() =>
    {
        initialize();
    }, [])

    async function initialize()
    {
        set_showLoading(false);
        set_showContent(true);
    }


    return (
        <div data-theme={theme} className={styles.container}>
            <Navigation currentLocation={'selectProgram'} theme={theme} toggleTheme={toggleTheme} />
            <Loading showLoading={showLoading} />

            <Fade in={showContent}>
                <div className={styles.contentContainer}>
                    <div className={styles.howToListenText}>
                        如何開啟已下載的「TS」檔案
                    </div>

                    <div className={styles.cardContainer}>
                        <div className={styles.howToListenCard}>
                            <img src={`/image/windows.png`} className={styles.howToListenCardOsImage} />
                            <Button
                                router={router}
                                navigateTo={'https://potplayer.daum.net/'}
                                text={'Pot Player'}
                            />
                        </div>

                        <div className={styles.howToListenCard}>
                            <img src={`/image/android.png`} className={styles.howToListenCardOsImage} />
                            <Button
                                router={router}
                                navigateTo={'https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad&pcampaignid=web_share'}
                                text={'MX Player'}
                            />
                        </div>

                        <div className={styles.howToListenCard}>
                            <img src={`/image/ios.png`} className={styles.howToListenCardOsImage} />
                            <Button
                                router={router}
                                navigateTo={'https://apps.apple.com/us/app/vlc-media-player/id650377962'}
                                text={'VLC Player'}
                            />
                        </div>
                    </div>
                </div>
            </Fade>
        </div>
    )
}

const Com = ({ }) =>
{
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Instruction />
        </Suspense>
    )
}

export default Com;

const Button = ({ router, navigateTo, text }) =>
{
    return (
        <div className={styles.btnContainer} onClick={() => { window.open(`${navigateTo}`, '_blank'); }}>
            {text}
        </div>
    )
}
