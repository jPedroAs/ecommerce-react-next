import styles from "./MovePopup.module.css";
import React, { useRef, useState } from 'react';
import { Product } from "../../Types/ProdutoInterface";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import api from "@/services/api";
import Swal from "sweetalert2";

const Popup = (props: Product) => {
    const quatRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLInputElement>(null);
    const [tipoMovimento, setTipoMovimento] = useState<"Entrada" | "Saida">("Entrada");

    async function PatchProduto(id: string) {
        try {
            const quantidadeMovimentada = quatRef.current?.value ? parseInt(quatRef.current.value, 10) : 0;
            const motivo = typeRef.current?.value || "";

            const body = {
                Descricao: motivo
            };

            await api.patch(`/Produto/qtd/${tipoMovimento}/${id}/${quantidadeMovimentada}`, body);

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Atualizado com Sucesso",
                showConfirmButton: false,
                timer: 1500
            });
            props.onClose();
        } catch (error) {
            console.error("Erro na atualização:", error);
            Swal.fire({
                text: "Ocorreu um Erro.",
                icon: "error"
            });
        }
    }

    return (
        <div className={styles.container}>
            <h2>Entrada e Saída</h2>
            <img src={props.img} alt="Foto do produto" className={styles.img} />

            <form className={styles.content}>
                <div className={styles.items}>
                    <FaSortAmountUpAlt className={styles.img} />
                    <input type="number" placeholder="Quantidade Movimentada" className={styles.input} ref={quatRef} />
                </div>

                <div className={styles.items}>
                    <FaSortAmountDown className={styles.img} />
                    <select
                        value={tipoMovimento}
                        onChange={(e) => setTipoMovimento(e.target.value as "Entrada" | "Saida")}
                        className={styles.input}
                    >
                        <option value="Entrada">Entrada</option>
                        <option value="Saida">Saída</option>
                    </select>
                </div>

                <div className={styles.items}>
                    <FaSortAmountDown className={styles.img} />
                    <input type="text" placeholder="Motivo" className={styles.input} ref={typeRef} />
                </div>
            </form>

            <button className={styles.btnClose} onClick={() => PatchProduto(props.id)}>Atualizar</button>
            <button className={styles.btnClose} onClick={props.onClose}>Fechar</button>
        </div>
    );
};

export default Popup;
