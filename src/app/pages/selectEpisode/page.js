"use client"

import axios from "axios";
import { Suspense, useEffect, useRef, useState } from "react";
import { getDateBeforeDays } from "../../utilities/DateTime";
import { downloadSegments, getSegmentUrls, mergeSegments } from "../../utilities/DownloadUtil";
import Loading from "../../components/Loading";
import styles from "./style.module.css";
import Navigation from "../../components/Navigation";
import EpisodeItem from "../../components/EpisodeItem";
import { Fade, Spinner } from "react-bootstrap";
import LoadMoreButton from "../../components/LoadMoreButton";
import Error from "../../components/Error";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/app/utilities/ThemeContext";
import * as Icon from "react-bootstrap-icons";
import { getStorageItem, setStorageItem } from "@/app/utilities/LocalStorage";

const SelectEpisode = ({ }) =>
{
    const router = useRouter();
    const searchParams = useSearchParams();

    const [channel, set_channel] = useState('');
    const [programName, set_programName] = useState('');
    const [program, set_program] = useState('');
    const [producer, set_producer] = useState('');

    const [episodes, setEpisodes] = useState([]);
    const [daysBefore, setDaysBefore] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [showContent, set_showContent] = useState(false);
    const [showLoading, set_showLoading] = useState(false);
    const [isLoading5, set_isLoading5] = useState(false);
    const [isLoading10, set_isLoading10] = useState(false);
    const [downloadProgress, set_downloadProgress] = useState({});
    const isCancelDownloadRef = useRef({});
    const isCancelLoadingRef = useRef(false);

    const [bookmarks, set_bookmarks] = useState({});

    const { theme, toggleTheme } = useTheme();

    useEffect(() => 
    {
        initialize();

        return () =>
        {
            isCancelLoadingRef.current = true;
            Object.keys(isCancelDownloadRef.current).forEach((episode) =>
            {
                isCancelDownloadRef.current[episode] = true;
            });
        };
    }, []);

    async function initialize()
    {
        await getEpisodeList(5);

        const new_bookmarks = await getStorageItem('bookmarks');
        set_bookmarks(new_bookmarks);
    }

    async function checkUrl(url)
    {
        try
        {
            const response = await axios.head(url, { validateStatus: status => status < 400, timeout: 500 });
            return true;
        }
        catch (error)
        {
            console.log('URL check error:', error.message);
            return false;
        }
    }

    async function getEpisodeList(getCount)
    {
        if (showLoading) return;

        set_showLoading(true);
        try
        {
            let new_program = searchParams.has('program') ? searchParams.get('program') : '';
            let new_channel = searchParams.has('channel') ? searchParams.get('channel') : '';
            let new_programName = searchParams.has('programName') ? searchParams.get('programName') : '';
            let new_producer = searchParams.has('producer') ? searchParams.get('producer') : '';

            set_program(new_program);
            set_channel(new_channel);
            set_programName(new_programName);
            set_producer(new_producer);

            const new_episodes = [];
            let tryCount = 0;

            while (new_episodes.length < getCount)
            {
                if (isCancelLoadingRef.current === true)
                {
                    break;
                }

                // Create batch of 8 URLs to check simultaneously
                const urlChecks = [];
                for (let i = 0; i < 7; i++)
                {
                    const currentDate = getDateBeforeDays(daysBefore + tryCount + i);
                    const url = `https://rthkaod2022.akamaized.net/m4a/radio/archive/${new_channel}/${new_program}/m4a/${currentDate.replaceAll('-', '')}.m4a/index_0_a.m3u8`;
                    urlChecks.push({
                        url,
                        date: currentDate,
                        checkPromise: checkUrl(url)
                    });
                }

                // Check all URLs in parallel
                const results = await Promise.all(urlChecks.map(check => check.checkPromise));

                // Process results
                results.forEach((valid, index) =>
                {
                    if (valid && new_episodes.length < getCount)
                    {
                        new_episodes.push(urlChecks[index].date);
                    }
                });

                tryCount += 7;
                // Break if we've tried too many times
                if (tryCount > (7 * getCount))
                {  // Arbitrary limit to prevent infinite loops
                    break;
                }
            }

            if (new_episodes.length === 0)
            {
                setHasMore(false);
            }
            else
            {
                const prevList = [...episodes];
                setEpisodes([...prevList, ...new_episodes]);
                setDaysBefore(daysBefore + tryCount);
            }

        } catch (error)
        {
            console.error('Error fetching episodes:', error);
            setHasMore(false);
        } finally
        {
            set_showLoading(false);
            set_showContent(true);
            set_isLoading5(false);
            set_isLoading10(false);
        }
    }

    async function startDownload(episode)
    {
        // initial download
        isCancelDownloadRef.current[episode] = false;

        set_downloadProgress((prev) =>
        {
            const newState = prev;
            newState[episode] = 0;
            return newState;
        });

        let segmentUrls;
        let segmentFiles;

        if (isCancelDownloadRef.current[episode] == false)
            segmentUrls = await getSegmentUrls(channel, program, episode, isCancelDownloadRef);

        if (isCancelDownloadRef.current[episode] == false)
            segmentFiles = await downloadSegments(channel, program, episode, segmentUrls, isCancelDownloadRef, set_downloadProgress);

        if (isCancelDownloadRef.current[episode] == false)
            await mergeSegments(segmentFiles, episode, programName, isCancelDownloadRef);

        // when download is finished
        delete isCancelDownloadRef.current[episode];

        set_downloadProgress((prev) =>
        {
            const newState = prev;
            delete newState[episode];
            return newState;
        })
    }

    async function cancelDownload(episode)
    {
        isCancelDownloadRef.current[episode] = true;

        set_downloadProgress((prev) =>
        {
            const newState = prev;
            delete newState[episode];
            return newState;
        })
    }

    async function onClickBookmarkBtn()
    {
        const new_bookmarks = { ...bookmarks };

        if (program in new_bookmarks)
            delete new_bookmarks[program];
        else
        {
            new_bookmarks[program] = {
                channel: channel,
                title: programName,
                folder: program,
                producer: producer
            }
        }


        set_bookmarks(new_bookmarks);

        await setStorageItem('bookmarks', new_bookmarks);
    }

    return (

        <div data-theme={theme} className={styles.container}>
            <Navigation currentLocation={'selectProgram'} theme={theme} toggleTheme={toggleTheme} />
            <Loading showLoading={showLoading} />

            <Fade in={showContent}>
                <div className={styles.contentContainer}>

                    {/* PROGRAM DETAILS */}
                    <div className={styles.programDetails}>
                        <div className={styles.programDetailsText}>
                            <div className={styles.channel}>{channel}</div>
                            <div className={styles.programName}>{programName}</div>
                        </div>

                        {program in bookmarks ?
                            <Icon.BookmarkFill size={30} className={styles.bookmarkBtn} onClick={(e) => { onClickBookmarkBtn(); }} /> :
                            <Icon.Bookmark size={30} className={styles.bookmarkBtn} onClick={(e) => { onClickBookmarkBtn(); }} />
                        }
                    </div>

                    {/* EPISODE LIST */}
                    <div className={styles.episodeList} >
                        {episodes && episodes.map((episode, index) =>
                            <EpisodeItem
                                key={index}
                                theme={theme}
                                episode={episode}
                                onClickDownload={() => startDownload(episode)}
                                onClickCancel={() => { cancelDownload(episode) }}
                                downloadProgress={downloadProgress}
                            />
                        )}

                        {episodes && episodes.length > 0 && (hasMore || showLoading) &&
                            <div className={styles.loadMoreBtnDiv}>
                                <LoadMoreButton
                                    theme={theme}
                                    text={'讀取更多 (5集)'}
                                    onClick={() => { if (showLoading == false) { getEpisodeList(5); set_isLoading5(true) } }}
                                    isLoading={isLoading5}
                                />

                                <LoadMoreButton
                                    theme={theme}
                                    text={'讀取更多 (10集)'}
                                    onClick={() => { if (showLoading == false) { getEpisodeList(10); set_isLoading10(true) }} }
                                    isLoading={isLoading10}
                                />
                            </div>
                        }

                        {!episodes || episodes.length == 0 &&
                            <Error text={'找不到集數'} />
                        }
                    </div>
                </div>
            </Fade>
        </div>

    );
}

const Com = ({ }) =>
{
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SelectEpisode />
        </Suspense>
    )
}
export default Com;