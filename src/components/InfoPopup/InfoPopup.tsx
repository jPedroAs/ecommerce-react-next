import styles from "./InfoPopup.module.css";
import React, { useState } from 'react';
import { Product } from "@/Types/PedidoInterface";
import { SiNamecheap } from "react-icons/si";
import { LuDollarSign } from "react-icons/lu";
import { MdOutlineDescription } from "react-icons/md";
import { FaSortAmountUpAlt } from "react-icons/fa";

const popup = (props: Product) => {

    return (
        <div className={styles.container}>
            <h2>Informações</h2>
            <img src={props.img} alt="Foto do camisa" className={styles.img} />

            <div className={styles.content}>

                <div className={styles.items}>
                    <SiNamecheap className={styles.img} />
                    <p className={styles.p}>{props.nome}</p>
                </div>
                <div className={styles.items}>
                    <LuDollarSign className={styles.img} />
                    <p className={styles.p}>{props.preco}</p>
                </div>
                <div className={styles.items}>
                    <MdOutlineDescription className={styles.img} />
                    <p className={styles.p}>{props.descricao}</p>
                </div>
                <div className={styles.items}>
                    <FaSortAmountUpAlt className={styles.img} />
                    <p className={styles.p}>{props.quantidade}</p>
                </div>

            </div>

            <button className={styles.btnClose} onClick={props.onClose}>Fechar</button>
        </div>
    );
};

export default popup;
