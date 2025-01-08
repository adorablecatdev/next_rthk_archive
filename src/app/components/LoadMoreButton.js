import { Spinner } from "react-bootstrap";
import styles from "./styles/LoadMoreButton.module.css";

const LoadMoreButton = ({ theme, text, onClick, isLoading }) =>
{
    return (
        <div
            data-theme={theme}
            className={isLoading ? styles.buttonInactive : styles.buttonActive}
            onClick={onClick}
        >
            {text}
            {isLoading &&  <Spinner animation="border" size="sm" variant="secondary" style={{ marginLeft:'5px'}} />}
        </div>
    )
}

export default LoadMoreButton;