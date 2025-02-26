import { useRouter } from "next/navigation";
import styles from "./styles/Navigation.module.css";
import * as Icon from "react-bootstrap-icons";
import { setStorageItem } from "../utilities/LocalStorage";

const Navigation = ({ theme, toggleTheme }) =>
{
    const router = useRouter();

    // const toggleTheme = () =>
    // {
    //     const new_theme = theme === 'light' ? 'dark' : 'light';
    //     set_theme(new_theme);
    //     setStorageItem('theme', new_theme);
    // };

    return (
        <div data-theme={theme} className={styles.container}>

            <div className={styles.leftContainer}>
                <HomeButton router={router} />
            </div>

            <div className={styles.rightContainer}>
                <IconTheme
                    icon={theme == 'light' ? (<Icon.Moon size={30} />) : (<Icon.Sun size={30} />)}
                    onClick={toggleTheme}
                />
                <IconButton router={router} navigateTo={"pages/bookmark"} icon={(<Icon.Bookmark size={30} />)} />
                {/* <IconButton router={router} navigateTo={"pages/setting"} icon={(<Icon.Gear size={30} />)} /> */}
            </div>

        </div>
    )
}

export default Navigation;

const HomeButton = ({ router }) =>
{
    return (
        <div className={styles.homeBtnContainer} onClick={() => { router.push("/") }}>
            <img className={styles.homeBtnIcon} src={`/image/rthk_logo.png`} />
            <div className={styles.homeBtnText}>
                香港電台節目重溫
            </div>
        </div>
    )
}

const IconTheme = ({ icon, onClick }) =>
{
    return (
        <div className={styles.btnIcon} onClick={onClick}>
            {icon}
        </div>
    )
}

const IconButton = ({ router, navigateTo, icon }) =>
{
    return (
        <div className={styles.btnIcon} onClick={() => { router.push(`/${navigateTo}`) }}>
            {icon}
        </div>
    )
}