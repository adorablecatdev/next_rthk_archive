"use client"

import axios from "axios";
import { Suspense, useEffect, useRef, useState } from "react";
import ProgramItem from "../../components/ProgramItem";
import styles from "./style.module.css";
import Loading from "../../components/Loading";
import Navigation from "../../components/Navigation";
import { Fade } from "react-bootstrap";
import ChannelButton from "../../components/ChannelButton";
import LoadMoreButton from "../../components/LoadMoreButton";
import Error from "../../components/Error";
import { useRouter, useSearchParams } from "next/navigation";
import { getStorageItem } from "@/app/utilities/LocalStorage";
import { useTheme } from "@/app/utilities/ThemeContext";

const SelectProgram = ({ }) =>
{
    const router = useRouter();
    const searchParams = useSearchParams();

    const { theme, toggleTheme } = useTheme();
    const [showContent, set_showContent] = useState(false);
    const [showLoading, set_showLoading] = useState(false);
    const [selectedStation, set_selectedStation] = useState('radio1');
    const [programList, set_programList] = useState([]);
    const [loadSegment, set_loadSegment] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const programListRef = useRef(null);
    const [bookmarks, set_bookmarks] = useState({});

    useEffect(() =>
    {
        initialize();
    }, [])

    async function initialize()
    {
        let new_selectedChannel = '';
        if (searchParams.has('channel'))
            new_selectedChannel = searchParams.get('channel');
        else
            new_selectedChannel = 'radio1';

        set_selectedStation(new_selectedChannel)

        getProgramList(true, new_selectedChannel);

        const new_bookmarks = await getStorageItem('bookmarks');
        set_bookmarks(new_bookmarks);
    }

    async function getProgramList(reset = false, selectedStation_in)
    {
        if (showLoading) return;

        set_showLoading(true);
        try
        {
            // await new Promise(r => setTimeout(r, 5000));
            const segment = reset ? 1 : loadSegment;

            const rthkUrl = `/api/getProgramList`;

            const result = await axios.post(rthkUrl, {
                "channel": selectedStation_in,
                "segment": segment
            });


            if (result?.data?.result)
            {
                const newPrograms = result.data.result;

                if (!newPrograms || newPrograms.length === 0)
                {
                    setHasMore(false);
                    return;
                }

                set_programList(prevList =>
                    reset ? newPrograms : [...prevList, ...newPrograms]
                );

                set_loadSegment(reset ? 2 : prev => prev + 1);
            }
            else 
            {
                setHasMore(false);
            }
        }
        catch (e)
        {
            console.log(e);
            setHasMore(false);
        }
        finally 
        {
            set_showLoading(false);
            set_showContent(true);
        }
    }

    function scrollToTop()
    {
        if (programListRef.current)
        {
            programListRef.current.scrollTo({ top: 0 });
        }
    }

    function onClickChannel(channel_in)
    {
        scrollToTop();
        set_selectedStation(channel_in);
        getProgramList(true, channel_in);
        set_loadSegment(1);
        setHasMore(true);

        const params = new URLSearchParams(searchParams);
        params.set('channel', channel_in);
        router.replace(`/pages/selectProgram?${params.toString()}`);
    }

    return (

        <div data-theme={theme} className={styles.container}>
            <Navigation currentLocation={'selectProgram'} theme={theme} toggleTheme={toggleTheme} />
            <Loading showLoading={showLoading} />

            <Fade in={showContent}>
                <div className={styles.contentContainer}>

                    <div className={styles.radioButtonContainer}>
                        <ChannelButton
                            theme={theme}
                            text={'第一台'}
                            onClick={() => { onClickChannel('radio1'); }}
                            isSelected={selectedStation == 'radio1'}
                        />
                        <ChannelButton
                            theme={theme}
                            text={'第二台'}
                            onClick={() => { onClickChannel('radio2'); }}
                            isSelected={selectedStation == 'radio2'}
                        />
                        <ChannelButton
                            theme={theme}
                            text={'第三台'}
                            onClick={() => { onClickChannel('radio3'); }}
                            isSelected={selectedStation == 'radio3'}
                        />
                        <ChannelButton
                            theme={theme}
                            text={'第四台'}
                            onClick={() => { onClickChannel('radio4'); }}
                            isSelected={selectedStation == 'radio4'}
                        />
                        <ChannelButton
                            theme={theme}
                            text={'第五台'}
                            onClick={() => { onClickChannel('radio5'); }}
                            isSelected={selectedStation == 'radio5'}
                        />
                    </div>

                    <div className={styles.programList} ref={programListRef}>

                        {programList && programList.map((program, index) =>
                            <ProgramItem
                                key={index}
                                theme={theme}
                                key_in={index}
                                program={program}
                                bookmarks={bookmarks}
                                set_bookmarks={set_bookmarks}
                            />
                        )}

                        {programList && programList.length > 0 && (hasMore || showLoading) &&
                            <LoadMoreButton
                                theme={theme}
                                text={showLoading ? '讀取中' : '讀取更多'}
                                onClick={() => { showLoading == false && getProgramList(false, selectedStation) }}
                                isLoading={showLoading}
                            />
                        }

                        {!programList || programList.length == 0 &&
                            <Error text={'找不到節目'} />
                        }
                    </div>
                </div>
            </Fade >
        </div >
    )
}

const Com = ({ }) =>
{
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SelectProgram />
        </Suspense>
    )
}

export default Com;