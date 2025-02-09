"use client"

import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import styles from "./style.module.css";
import { getStorageItem } from "../../utilities/LocalStorage";
import { Fade } from "react-bootstrap";
import BookmarkItem from "./components/BookmarkItem";
import { useTheme } from "@/app/utilities/ThemeContext";
import * as Icons from "react-bootstrap-icons";

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

                    {Object.entries(bookmarks).length > 0 &&
                        <div className={styles.bookmarkList}>
                            {bookmarks && Object.entries(bookmarks).map(([key, bookmark]) =>
                                <BookmarkItem theme={theme} key={key} program={bookmark} bookmarks={bookmarks} set_bookmarks={set_bookmarks} />
                            )}
                        </div>
                    }

                    {Object.entries(bookmarks).length == 0 &&
                        <div className={styles.noBookmarkAlert}>
                            <Icons.BookmarkX size={60} className={styles.noBookmarkIcon}/>
                                <div className={styles.noBookmarkText}>沒有收藏節目</div>
                        </div>
                    }

                </div>
            </Fade>
        </div>
    )
}

export default Bookmark;