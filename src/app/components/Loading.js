import { Fade, Spinner } from 'react-bootstrap';
import styles from './styles/Loading.module.css';

const Loading = ({ theme, showLoading }) =>
{

    return (
        <>
            {showLoading &&
                <div data-theme={theme} className={styles.spinnerContainer} >
                    <div className={styles.spinnerGrid}>
                        <Spinner animation="border" size="lg" variant="primary" />
                    </div>
                </div>
            }
        </>
    )
}

export default Loading;