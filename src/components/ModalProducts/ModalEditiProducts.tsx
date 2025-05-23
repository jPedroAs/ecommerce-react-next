"use client";
import React, { useRef, useState } from "react";
import "../index.css"
import { Product } from "../../Types/ProdutoInterface"
import api from "../../services/api"
import Swal from 'sweetalert2';
import { useAuthStore } from "@/store/authStore";


interface modal {
    isOpen?: boolean,
    onClosed?: () => void,
    data: Product[]
}
export default function ModalProducts({ isOpen, onClosed, data }: modal) {
    const NomeRef = useRef<HTMLInputElement>(null);
    const ValorRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const quatRef = useRef<HTMLInputElement>(null);
    const [products, setProducts] = useState<Product[]>([]);


    if (!isOpen) return null

    console.log(data);

    async function PutProduto(id: string) {
        try {
            useAuthStore.getState().loadUserFromCookies();
            const curso = useAuthStore.getState().user?.Curso;
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
                IMG: base64Image || data[0].img,
                Categoria: "outros",
                Quantidade: quatRef.current?.value,
                Curso: curso,
                Aval: 0,
                QAval: 0
            }
            console.log(body);
            await api.put(`/Produto/${id}`, body);
            isOpen = false
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
                icon: "error",
            });
        }
    }

    async function handleDelete(id: string) {
        try {
            console.log(id)
            const response = await api.delete(`/Produto/${id}`);
            console.log(response)
            setProducts(products.filter(product => product.id !== id));
            Swal.fire({
                text: "Produto deletado com sucesso.",
                icon: "success",
            });
        } catch (error) {
            Swal.fire({
                text: "Erro ao deletar o produto.",
                icon: "error",
            });
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* <div className="max-w-2xl mx-auto flex flex-col items-center mt-6"> */}
            <form onSubmit={() => PutProduto} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-gray-700">Editar Produto</h2>
                {data.map((product) => (
                    <div className="flex flex-col gap-4 " key={product.id}>
                        <input
                            type="text"
                            placeholder="Nome"
                            defaultValue={product.nome}
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black "
                            ref={NomeRef}
                        />
                        <input
                            type="number"
                            placeholder="Valor"
                            defaultValue={product.preco}
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            ref={ValorRef}
                        />
                        <img src={
                            product?.img && typeof product.img === "string" && product.img.startsWith("data:image")
                                ? product.img
                                : `data:image/png;base64,${product?.img || ""}`
                        }
                            alt={product?.nome || "Produto sem nome"}
                            className="h-12 w-12 object-cover" />
                        <input
                            type="file"
                            accept="image/*"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            ref={imageRef}
                        />
                        <input
                            type="text"
                            placeholder="Descrição"
                            defaultValue={product.descricao}
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            ref={descRef}
                        />
                        <button onClick={() => PutProduto(product.id)} className="bg-blue-600 text-white p-3 rounded-lg w-full text-lg hover:bg-blue-700">
                            Enviar
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="bg-blue-600 text-white p-3 rounded-lg w-full text-lg hover:bg-blue-700">
                            Deletar
                        </button>
                        <button onClick={onClosed} className="bg-blue-600 text-white p-3 rounded-lg w-full text-lg hover:bg-blue-700">
                            Cancelar
                        </button>
                    </div>
                ))}

            </form>
        </div>
        // </div>

    );
}