// import { Link, useNavigate } from "react-router-dom";
import { setStorageItem } from "@/app/utilities/LocalStorage";
import styles from "./BookmarkItem.module.css";
import * as Icon from "react-bootstrap-icons";
import Link from "next/link";

const BookmarkItem = ({ theme, program, bookmarks, set_bookmarks }) =>
{
    // const navigation = useNavigate();

    async function onClickBookmarkBtn(e, program)
    {
        e.stopPropagation();

        const new_bookmarks = { ...bookmarks };

        if (program?.folder in new_bookmarks)
            delete new_bookmarks[program?.folder];
        else
            new_bookmarks[program?.folder] = program;

        set_bookmarks(new_bookmarks);

        await setStorageItem('bookmarks', new_bookmarks);
    }

    return (
        <div
            data-theme={theme}
            className={styles.mainContainer}
        >
            <Link
                className={styles.leftContainer}
                href={`/pages/selectEpisode?channel=${program?.channel}&program=${program?.folder}&programName=${program?.title}&producer=${program?.producer}`} state={{ program }}
            >
                <div className={styles.channelContainer}>
                    {`${program?.channel}`}
                </div>

                <div className={styles.programNameAndPresenterContainer}>
                    <div className={styles.programName}>
                        {program?.title || '-'}
                    </div>
                    <div className={styles.presenter}>
                        {program?.producer || '-'}
                    </div>
                </div>
            </Link>
            <div className={styles.bookmarkBtnContainer} onClick={(e) => { onClickBookmarkBtn(e, program); }}>
                {program?.folder in bookmarks ?
                    <Icon.BookmarkFill size={30} className={styles.bookmarkBtn} /> :
                    <Icon.Bookmark size={30} className={styles.bookmarkBtn} />
                }
            </div>
        </div>
    )
}

export default BookmarkItem;