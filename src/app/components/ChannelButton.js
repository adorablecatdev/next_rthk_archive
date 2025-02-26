import styles from "./styles/ChannelButton.module.css";

const ChannelButton = ({ theme, text, onClick, isSelected }) =>
{
    return (
        <div
            data-theme={theme}
            className={isSelected ? styles.buttonSelected : styles.button}
            onClick={onClick}
        >
            {text}
        </div>
    )
}

export default ChannelButton;