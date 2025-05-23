"use client";
import styles from "./MainBar.module.css";
import Link from "next/link";
import ModalCart from "../ModalCart/Cart";
import { useEffect, useState } from "react";
import { FiCodesandbox } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { FaBars, FaRegUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";

const MainBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [useRole, setUseRole] = useState<string | undefined>();

    useEffect(() => {
        useAuthStore.getState().loadUserFromCookies();
        const role_user = useAuthStore.getState().user?.role;
        setUseRole(role_user);
    }, []);

    const toggleMenu = () => {
        setIsVisible((prev) => !prev);
    };

    const handlerModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleCart = () => {
        setModalOpen(true);
    };

    const Logout = () => {
        useAuthStore.getState().logout();
        window.location.href = "/Login";
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <div><FiCodesandbox className={styles.i} /></div>
                    <h1>UniStores</h1>
                </div>

                <div className={styles.hamburger} onClick={toggleMenu}>
                    <FaBars className={styles.hamburgerIcon} />
                </div>

                <nav className={`${styles.options} ${isVisible ? styles.optionsActive : ""}`}>
                    <ul>
                        <li><Link href="/Catalog" className={styles.a}>Home</Link></li>
                        {useRole === "admin" && (
                            <li><Link href="/Products" className={styles.a}>Products</Link></li>
                        )}
                        <li><Link href="/Avaliacao" className={styles.a}>Review</Link></li>
                        {useRole === "admin" && (
                            <li><Link href="/Dash" className={styles.a}>Dashboard</Link></li>
                        )}
                    </ul>
                </nav>

                <nav className={`${styles.icons} ${isVisible ? styles.iconsActive : ""}`}>
                    <div><LuShoppingCart className={styles.i} onClick={handleCart} /></div>
                    <div><Link href="/User" className={styles.choissesicons}><FaRegUser className={styles.i} /></Link></div>
                    <div><Link href="/Favorites" className={styles.choissesicons}><AiFillStar className={styles.i} /></Link></div>
                    <div onClick={Logout}><MdLogout className={styles.i} /></div>
                </nav>
            </header>

            <ModalCart isOpen={modalOpen} onClosed={handlerModal} />
        </>
    );
};

export default MainBar;
