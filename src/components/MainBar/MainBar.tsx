import styles from "./MainBar.module.css";
import logo from "../../assets/Icon.png";
import Link from "next/link"
import search from "../../assets/Search.svg"
import cart from "../../assets/Shopping cart.svg"
import user from "../../assets/User.svg"
import ModalCart from "../components/ModalCart/Cart";
import { useState } from "react"; // Importe useState

const MainBar = () => {

    const [navHeight, setNavHeight] = useState("80px"); // Altura inicial
    const [isVisible, setIsVisible] = useState(false); // Estado inicial: oculto

    const toggleNavHeight = () => {
        setNavHeight(navHeight === "80px" ? "120px" : "80px"); // Altera a altura
        setIsVisible(!isVisible); // Inverte a visibilidade
    };
    
    const [modalOpen, setModalOpen] = useState(false);
    function handlerModal() {
        setModalOpen(!modalOpen)
    }

    async function handleCart() {
        setModalOpen(true);
    }

    return (
        <nav className={styles.nav} style={{ height: navHeight }}>
            <div className={styles.container}>

                <div className={styles.logo}>
                    <img src={logo.src} />
                    <h1>UniStore</h1>
                </div>

                <div className={styles.choisses}>
                    <Link href="/Home" className={styles.link}>Home</Link>
                    <Link href="/Produtos" className={styles.link}>Products</Link>
                    <Link href="/Categories" className={styles.link}>Categories</Link>
                    <Link href="/Review" className={styles.link}>Review</Link>
                </div>

                <div className={styles.icons}>
                    <button className={styles.choissesicons}  onClick={toggleNavHeight}><img src={search.src} id={styles.search}/></button>
                    <button onClick={handleCart} className={styles.choissesicons}><img src={cart.src}/></button>
                    <Link href="/User" className={styles.choissesicons}><img src={user.src}/></Link>
                </div>
            </div>
            <ModalCart isOpen={modalOpen} onClosed={handlerModal} />
            {isVisible && <div className={styles.searchbar}><input type="text" placeholder="Pesquise Aqui"/></div>}
        </nav>
    );
};

export default MainBar;
