import styles from "./InfoPopup.module.css";
import React, { useState } from 'react';
import { Product } from "@/Types/PedidoInterface";
import NameIcom from "../../Assets/FormCad/NameIcon.svg";
import ValueIcon from "../../Assets/FormCad/ValueIcon.svg";
import AboutIcom from "../../Assets/FormCad/AboutIcon.svg";
import AmountIcom from "../../Assets/FormCad/AmountIcon.svg";

const popup = (props: Product) => {

    return (
        <div className={styles.container}>
            <h2>Informações</h2>
            <img src={props.img} alt="Foto do camisa" className={styles.img} />

            <div className={styles.content}>

                <div className={styles.items}>
                    <img src={NameIcom.src} alt="Nome" />
                    <p className={styles.p}>{props.nome}</p>
                </div>
                <div className={styles.items}>
                    <img src={ValueIcon.src} alt="Valor" />
                    <p className={styles.p}>{props.preco}</p>
                </div>
                <div className={styles.items}>
                    <img src={AboutIcom.src} alt="Descrição" />
                    <p className={styles.p}>{props.descricao}</p>
                </div>
                <div className={styles.items}>
                    <img src={AmountIcom.src} alt="Quantidade" />
                    <p className={styles.p}>{props.quantidade}</p>
                </div>

            </div>

            <button className={styles.btnClose} onClick={props.onClose}>Fechar</button>
        </div>
    );
};

export default popup;
