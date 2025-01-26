"use client"

import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import styles from "./style.module.css";
import { getStorageItem } from "../../utilities/LocalStorage";
import { Fade } from "react-bootstrap";
import BookmarkItem from "./components/BookmarkItem";
import { useTheme } from "@/app/utilities/ThemeContext";

const Bookmark = ({ }) =>
{
    const { theme, toggleTheme } = useTheme();
    const [showContent, set_showContent] = useState(false);
    const [bookmarks, set_bookmarks] = useState({});

    useEffect(() =>
    {
        initialize();
    }, [])

    async function initialize()
    {
        const new_bookmarks = await getStorageItem('bookmarks');
        set_bookmarks(new_bookmarks);
        set_showContent(true);
    }

    return (
        <div data-theme={theme} className={styles.container}>
            <Navigation currentLocation={'bookmark'} theme={theme} toggleTheme={toggleTheme} />

            <Fade in={showContent}>
                <div className={styles.contentContainer}>

                    <div className={styles.leftSectionContainer}>
                        收藏節目
                    </div>

                    <div className={styles.bookmarkList}>
                        {bookmarks && Object.entries(bookmarks).map(([key, bookmark]) =>
                            <BookmarkItem theme={theme} key={key} program={bookmark} bookmarks={bookmarks} set_bookmarks={set_bookmarks} />
                        )}
                    </div>

                </div>
            </Fade>
        </div>
    )
}

export default Bookmark;