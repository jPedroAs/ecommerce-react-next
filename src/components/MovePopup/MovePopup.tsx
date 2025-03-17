import styles from "./MovePopup.module.css";
import React, { useRef } from 'react';
import { Product } from "../../Types/ProdutoInterface";
import { SiNamecheap } from "react-icons/si";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import api from "@/services/api";
import Swal from "sweetalert2";

const Popup = (props: Product) => {
    const quatRefEnter = useRef<HTMLInputElement>(null);
    const quatRefExit = useRef<HTMLInputElement>(null);

    async function PutProduto(id: string) {
        try {
            const QuantEnter = quatRefEnter.current?.value ? parseInt(quatRefEnter.current.value, 10) : 0;
            const QuantExit = quatRefExit.current?.value ? parseInt(quatRefExit.current.value, 10) : 0;
            props.onClose
            const body = {
                Nome: props.nome,
                Descricao: props.descricao,
                Preco: props.preco,
                IMG: props.img,
                Categoria: "ADS",
                Quantidade: props.quantidade + QuantEnter - QuantExit,
                Curso: "ads",
                Aval: 0,
                QAval: 0
            };
            console.log(body);
            await api.put(`/Produto/${id}`, body);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Atualizado com Sucesso",
                showConfirmButton: false,
                timer: 1500
            });
        } catch {
            Swal.fire({
                text: "Ocorreu um Error.",
                icon: "error"
            });
        }
    }

    return (
        <div className={styles.container}>
            <h2>Entrada e Saida</h2>
            <img src={props.img} alt="Foto do produto" className={styles.img} />

            <form className={styles.content}>
                <div className={styles.items}>
                    <SiNamecheap className={styles.img} />
                    <p className={styles.p}>{props.nome}</p>
                </div>
                <div className={styles.items}>
                    <FaSortAmountUpAlt className={styles.img} />
                    <input type="number" placeholder="Entrada" className={styles.input} ref={quatRefEnter} />
                </div>
                <div className={styles.items}>
                    <FaSortAmountDown className={styles.img} />
                    <input type="number" placeholder="Saida" className={styles.input} ref={quatRefExit} />
                </div>
            </form>

            <button className={styles.btnClose} onClick={() => PutProduto(props.id)}>Atualizar</button>
            <button className={styles.btnClose} onClick={props.onClose}>Fechar</button>

        </div>
    );
};

export default Popup;