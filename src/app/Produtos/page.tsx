"use client";
import "../Produtos/index.css"
import ModalProducts from "../../components/ModalProducts/ModalEditiProducts";
import api from "../../services/api"
import { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Product } from "../../interface/ProdutoInterface"
import MainBar from "@/components/MainBar/MainBar";



function Produtos() {
    const NomeRef = useRef<HTMLInputElement>(null);
    const ValorRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const quatRef = useRef<HTMLInputElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    function handlerModal() {
        setModalOpen(!modalOpen)
    }
    const fetchProducts = async () => {
        try {
            const response = await api.get(`/Produto`);
            const data = await response.data;
            console.log(data)
            setProducts(data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }
    useEffect(() => {
        fetchProducts()
    }, []);

    async function PostProduto(event: React.FormEvent) {
        event.preventDefault();
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
                IMG: base64Image,
                Categoria: "ADS",
                Quantidade: quatRef.current?.value,
                Curso: "ads",
                Aval: 0,
                QAval: 0
            }
            console.log(body);
            const response = await api.post('/Produto', body);

            Swal.fire({
                text: "Seu cadastro foi concluído com sucesso.",
                icon: "success",
            }).then(() => {
                NomeRef.current!.value = "";
                descRef.current!.value = "";
                ValorRef.current!.value = "";
                quatRef.current!.value = "";
                if (imageRef.current) {
                    imageRef.current.value = "";
                }
                fetchProducts();
            });
        }
         catch {
        Swal.fire({
            text: "Ocorreu um Error.",
            icon: "error",
        });
    }
}


async function handleDelete(productId: string) {
    try {
        console.log(productId)
        const response = await api.delete(`/Produto/${productId}`);
        console.log(response)
        setProducts(products.filter(product => product.id !== productId));
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

async function handleEdit(productId: string) {

    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
        setSelectedProduct(productToEdit);
        setModalOpen(true);
    }
}


return (
    <div className="block bg-white min-h-screen">
      <MainBar />
      <div className="max-w-4xl mx-auto flex flex-col items-center mt-6">
            <form className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center text-gray-700">Cadastro De Produto</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                    ref={NomeRef} />
                <input
                    type="number"
                    placeholder="Valor"
                    className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                    ref={ValorRef} />
                <input
                    type="file"
                    accept="image/*"
                    placeholder="Imagem (URL)"
                    className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                    ref={imageRef} />
                <input
                    type="text"
                    placeholder="Descrição"
                    className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                    ref={descRef} />
                <input
                    type="number"
                    placeholder="Quantidade"
                    className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                    ref={quatRef} />
                <button onClick={PostProduto} className="bg-blue-600 text-white p-4 rounded-lg w-full text-lg hover:bg-blue-700">
                    Enviar
                </button>
            </form>

            <div className="mt-10 w-full  mb-8">
                <h2 className="text-xl font-bold mb-4 text-center">Seus Produtos</h2>
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border text-black">Imagem</th>
                            <th className="p-2 border text-black">Nome</th>
                            <th className="p-2 border text-black">Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="border">
                                    <td className="p-2 border">
                                        <img src={
                                            product?.img && typeof product.img === "string" && product.img.startsWith("data:image")
                                                ? product.img
                                                : `data:image/png;base64,${product?.img || ""}`
                                        }
                                            alt={product?.nome || "Produto sem nome"}
                                            className="h-12 w-12 object-cover" />
                                    </td>
                                    <td className="p-2 border text-black">{product.nome}</td>
                                    <td className="p-2 border text-black">R${product.preco}</td>
                                    <td className="flex justify-center space-x-2 mt-3">
                                        <button onClick={() => handleEdit(product.id)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-green-600 transition ">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-red-600 transition ml-2">
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">
                                    Nenhum produto encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        <ModalProducts isOpen={modalOpen} onClosed={handlerModal} data={selectedProduct ? [selectedProduct] : []} />
    </div>

);
}

export default Produtos