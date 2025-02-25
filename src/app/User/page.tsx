"use client";
import "../Produtos/index.css"
import Navbar from "../../components/NavBar";
import ModalProducts from "../../components/ModalProducts/ModalEditiProducts";
import api from "../../services/api"
import { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Product } from "../../interface/ProdutoInterface"



function Produtos() {
    const NomeRef = useRef<HTMLInputElement>(null);
    const EmailRef = useRef<HTMLInputElement>(null);
    const SenhaRef = useRef<HTMLInputElement>(null);
    const RARef = useRef<HTMLInputElement>(null);
    const RoleRef = useRef<HTMLInputElement>(null);
    const CepRef = useRef<HTMLInputElement>(null);
    const RuaRef = useRef<HTMLInputElement>(null);
    const BairroRef = useRef<HTMLInputElement>(null);
    const CidadeRef = useRef<HTMLInputElement>(null);
    const EstadoRef = useRef<HTMLInputElement>(null);
    const NumeroRef = useRef<HTMLInputElement>(null);
    const TelefoneRef = useRef<HTMLInputElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get(`/Produto`);
                const data = await response.data;
                console.log(data)
                setProducts(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        }

        fetchProducts();
    }, []);

    async function PutProduto() {
        // try {
        //     const body = {
        //         Nome: NomeRef.current?.value,
        //         Descricao: descRef.current?.value,
        //         Preco: ValorRef.current?.value,
        //         Categoria: "ADS",
        //         Quantidade: quatRef.current?.value,
        //         Curso: "ads",
        //         Aval: 0,
        //         QAval: 0
        //     }
        //     console.log(body);
        //     const response = await api.post('/Produto', body);

        //     Swal.fire({
        //         text: "Seu cadastro foi concluído com sucesso.",
        //         icon: "success",
        //     });

        // } catch {
        //     Swal.fire({
        //         text: "Ocorreu um Error.",
        //         icon: "error",
        //     });
        // }
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

    // async function handleEdit(productId: string) {

    //     const productToEdit = products.find((product) => product.id === productId);
    //     if (productToEdit) {
    //         setSelectedProduct(productToEdit);
    //         setModalOpen(true);
    //     }
    // }


    return (
        <div className="block bg-white min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto flex flex-col items-center mt-6">
                <form className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-center text-gray-700">Cadastro De Produto</h2>
                    <input
                        type="text"
                        placeholder="Nome"
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={NomeRef} />
                    <input
                        type="text"
                        placeholder="Email "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={EmailRef} />
                    <input
                        type="Password"
                        placeholder="Senha"
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={SenhaRef} />
                    <input
                        type="text"
                        placeholder="RA "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={RARef} />
                    <input
                        type="text"
                        placeholder="Telefone "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={TelefoneRef} />
                    <input
                        type="text"
                        placeholder="Role  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={RoleRef} />
                    <input
                        type="text"
                        placeholder="Cep  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={CepRef} />
                    <input
                        type="text"
                        placeholder="Rua  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={RuaRef} />
                    <input
                        type="text"
                        placeholder="Bairro  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={BairroRef} />
                    <input
                        type="text"
                        placeholder="Cidade  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={CidadeRef} />
                    <input
                        type="text"
                        placeholder="Estado  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={EstadoRef} />
                    <input
                        type="text"
                        placeholder="Numero  "
                        className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                        ref={NumeroRef} />
                    <button onClick={PutProduto} className="bg-blue-600 text-white p-4 rounded-lg w-full text-lg hover:bg-blue-700">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
        
    );
}

export default Produtos