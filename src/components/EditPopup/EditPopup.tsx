import styles from "./EditPopup.module.css";
import React, { useRef, useState } from 'react';
import { Product } from "@/Types/PedidoInterface";
import { SiNamecheap } from "react-icons/si";
import { LuDollarSign } from "react-icons/lu";
import { GoFileDirectory } from "react-icons/go";
import { MdOutlineDescription } from "react-icons/md";
import api from "@/services/api";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";

interface PopupProps extends Product { }

const Popup = (props: PopupProps) => {

    const NomeRef = useRef<HTMLInputElement>(null);
    const ValorRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    async function PutProduto(id: string) {
        try {
            useAuthStore.getState().loadUserFromCookies();
            const curso = useAuthStore.getState().user?.Curso;
            const universidade = useAuthStore.getState().user?.Universidade;
            const file = imageRef.current?.files?.[0];
            let base64Image = "";

            if (file) {
                const reader = new FileReader();
                base64Image = await new Promise<string>((resolve, reject) => {
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = (error) => reject(error);
                });
            }
            const body = {
                Nome: NomeRef.current?.value,
                Descricao: descRef.current?.value,
                Preco: ValorRef.current?.value,
                IMG: base64Image || props.img,
                Categoria: "outros",
                Curso: curso,
                Universidade: universidade,
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
            props.onClose
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            Swal.fire({
                text: "Ocorreu um Erro ao atualizar o produto.",
                icon: "error",
            });
        }
    }

    return (
        <div className={styles.container}>
            <h2>Atualizar Produto</h2>
            <img src={props.img} alt="Foto do camisa" className={styles.img} />

            <form className={styles.form}>
                <div className={styles.items}>
                    <SiNamecheap className={styles.img} />
                    <input type="text" placeholder="Nome" className={styles.input} ref={NomeRef} defaultValue={props.nome} />
                </div>
                <div className={styles.items}>
                    <LuDollarSign className={styles.img} />
                    <input type="number" placeholder="Valor" className={styles.input} ref={ValorRef} defaultValue={props.preco} />
                </div>
                <div className={styles.items}>
                    <GoFileDirectory className={styles.img} />
                    <input type="file" accept="image/*" className={styles.input} ref={imageRef} />
                </div>
                <div className={styles.items}>
                    <MdOutlineDescription className={styles.img} />
                    <input type="text" placeholder="Descrição" className={styles.input} ref={descRef} defaultValue={props.descricao} />
                </div>
            </form>

            <div className={styles.BtnGroup}>
                <button onClick={() => PutProduto(props.id)} className={styles.btnClose}>Enviar</button>
                <button onClick={props.onClose} className={styles.btnClose}>Fechar</button>
            </div>
        </div>
    );
};

export default Popup;