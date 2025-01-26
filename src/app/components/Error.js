import styles from "./styles/Error.module.css";

const Error = ({text}) => {
    return (
        <div className={styles.container}>
            <img src={`/image/error.png`} className={styles.image}/>
            <div className={styles.text}>{text}</div>
        </div>
    )
}

export default Error;