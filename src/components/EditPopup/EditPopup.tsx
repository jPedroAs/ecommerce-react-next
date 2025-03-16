import styles from "./EditPopup.module.css";
import React, { useRef, useState } from 'react';
import { Product } from "@/Types/PedidoInterface";
import NameIcom from "../../Assets/FormCad/NameIcon.svg";
import ValueIcon from "../../Assets/FormCad/ValueIcon.svg";
import FileIcon from "../../Assets/FormCad/FileIcon.svg";
import AboutIcom from "../../Assets/FormCad/AboutIcon.svg";
import api from "@/services/api";
import Swal from "sweetalert2";

interface PopupProps extends Product { }

const Popup = (props: PopupProps) => {

    const NomeRef = useRef<HTMLInputElement>(null);
    const ValorRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [products, setProducts] = useState<Product[]>([]);

    async function PutProduto(id: string) {
        try {
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
                Categoria: "ADS",
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
            props.onClose
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            Swal.fire({
                text: "Ocorreu um Erro ao atualizar o produto.",
                icon: "error",
            });
        }
    }

    async function handleDelete(id: string) {
        try {
            console.log(id);
            const response = await api.delete(`/Produto/${id}`);
            console.log(response);
            setProducts(products.filter(product => product.id !== id));
            Swal.fire({
                text: "Produto deletado com sucesso.",
                icon: "success",
            });
            props.onClose
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            Swal.fire({
                text: "Erro ao deletar o produto.",
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
                    <img src={NameIcom.src} alt="Nome" />
                    <input type="text" placeholder="Nome" className={styles.input} ref={NomeRef} />
                </div>
                <div className={styles.items}>
                    <img src={ValueIcon.src} alt="Valor" />
                    <input type="number" placeholder="Valor" className={styles.input} ref={ValorRef} />
                </div>
                <div className={styles.items}>
                    <img src={FileIcon.src} alt="Arquivo" />
                    <input type="file" accept="image/*" className={styles.input} ref={imageRef} />
                </div>
                <div className={styles.items}>
                    <img src={AboutIcom.src} alt="Descrição" />
                    <input type="text" placeholder="Descrição" className={styles.input} ref={descRef} />
                </div>
            </form>

            <div className={styles.BtnGroup}>
                <button onClick={() => PutProduto(props.id)} className={styles.btnClose}>Enviar</button>
                <button onClick={() => handleDelete(props.id)} className={styles.btnClose}>Deletar</button>
                <button onClick={props.onClose} className={styles.btnClose}>Fechar</button>
            </div>
        </div>
    );
};

export default Popup;