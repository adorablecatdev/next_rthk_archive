
import styles from "./styles/ProgramItem.module.css";
import * as Icon from "react-bootstrap-icons";
import { setStorageItem } from "../utilities/LocalStorage";
import Link from "next/link";

const ProgramItem = ({ theme, key_in, program, bookmarks, set_bookmarks }) =>
{
    async function onClickBookmarkBtn(e, program)
    {
        e.stopPropagation();

        const new_bookmarks = { ...bookmarks };

        if (program?.folder in new_bookmarks)
            delete new_bookmarks[program?.folder];
        else
        {
            new_bookmarks[program?.folder] = {
                channel: program?.channel,
                title: program?.title,
                folder: program?.folder,
                producer: program?.producer
            };
        }
           

        set_bookmarks(new_bookmarks);

        await setStorageItem('bookmarks', new_bookmarks);
    }

    return (
        <div
            data-theme={theme}
            key={key_in}
            className={styles.mainContainer}
        >
            <Link
                className={styles.leftContainer}
                href={`/pages/selectEpisode?channel=${program?.channel}&program=${program?.folder}&programName=${program?.title}&producer=${program?.producer}`} state={{ program }}
            >
                <div className={styles.timeContainer}>
                    {`${program?.latestDate}`}
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

export default ProgramItem;