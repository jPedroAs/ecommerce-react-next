"use client";
import styles from "./MainBar.module.css";
import logo from "../../assets/Icon.png";
import Link from "next/link"
import search from "../../assets/Search.svg"
import cart from "../../assets/Shopping cart.svg"
import user from "../../assets/User.svg"
import ModalCart from "../ModalCart/Cart";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { FiCodesandbox } from "react-icons/fi";

const MainBar = () => {

    const [navHeight, setNavHeight] = useState("80px");
    const [isVisible, setIsVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    function handlerModal() {
        setModalOpen(!modalOpen)
    }

    async function handleCart() {
        setModalOpen(true);
    }

    const toggleNavHeight = () => {
        setNavHeight(navHeight === "80px" ? "120px" : "80px");
        setIsVisible(!isVisible);
    };


    return (
        <>
            <nav className={styles.nav} style={{ height: navHeight }}>
                <div className={styles.container}>

                    <div className={styles.logo}>
                        <FiCodesandbox className={styles.img} />
                        <h1>UniStore</h1>
                    </div>

                    <div className={styles.choisses}>
                        <Link href="/Home" className={styles.link}>Home</Link>
                        <Link href="/Products" className={styles.link}>Products</Link>
                        <Link href="/Categories" className={styles.link}>Categories</Link>
                        <Link href="/Review" className={styles.link}>Review</Link>
                    </div>

                    <div className={styles.icons}>
                        <button className={styles.choissesicons} onClick={toggleNavHeight}><CiSearch id={styles.search} className={styles.img} /></button>
                        <button className={styles.choissesicons} onClick={handleCart}><IoCartOutline className={styles.img} /></button>
                        <Link href="/User" className={styles.choissesicons}><CiUser className={styles.img} /></Link>
                    </div>
                </div>
                {isVisible && <div className={styles.searchbar}><input type="text" placeholder="Pesquise Aqui" /></div>}
            </nav>
            <ModalCart isOpen={modalOpen} onClosed={handlerModal} />
        </>
    );
};

export default MainBar;
