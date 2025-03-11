import { useState, useRef, useEffect } from "react";
import styles from "./DivisorLogin.module.css";
import { Divisor } from '../../types/interface';

const DivisorLogin = (props: Divisor & { onClick: () => void }) => {
    const [isMoved, setIsMoved] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleHomeClick = () => {
        setIsMoved(!isMoved);
        props.onClick(); // Chama a função onClick passada pelo componente pai
    };

    useEffect(() => {
        if (isMoved && containerRef.current) {
            containerRef.current.classList.add(styles.mover);
        } else if (containerRef.current) {
            containerRef.current.classList.remove(styles.mover);
        }
    }, [isMoved]);

    return (
        <>
            <div className={styles.main}>
                <div ref={containerRef} className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.welcome}>
                            <h1>{props.h1}</h1>
                            <p>{props.p}</p>
                        </div>
                        <button className={styles.btnLogin} onClick={handleHomeClick}>{props.btn}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DivisorLogin;