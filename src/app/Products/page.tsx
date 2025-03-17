"use client"
import MainBar from "@/components/MainBar/MainBar";
import styles from "./Products.module.css";
import { FaEdit, FaSortAmountUpAlt } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { Product } from "../../Types/ProdutoInterface"
import React, { useState, useRef, useEffect } from 'react';
import api from "@/services/api";
import Swal from "sweetalert2";
import ModalProducts from "@/components/ModalProducts/ModalEditiProducts";
import { IoIosInformationCircleOutline } from "react-icons/io";
import InfoPopup from "../../components/InfoPopup/InfoPopup"
import MovePopup from "../../components/MovePopup/MovePopup"
import EditPopup from "../../components/EditPopup/EditPopup"
import { SiNamecheap } from "react-icons/si";
import { LuDollarSign } from "react-icons/lu";
import { GoFileDirectory } from "react-icons/go";
import { MdOutlineDescription } from "react-icons/md";


const Products = () => {

    const NomeRef = useRef<HTMLInputElement>(null);
    const ValorRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const quatRef = useRef<HTMLInputElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [exibirComponenteInfo, setExibirComponenteInfo] = useState(false);
    const [exibirComponenteMove, setExibirComponenteMove] = useState(false);
    const [exibirComponenteEdit, setExibirComponenteEdit] = useState(false);

    const handleCloseMovePopup = () => {
        setExibirComponenteMove(false);
    };

    const handleCloseInfoPopup = () => {
        setExibirComponenteInfo(false);
    };

    const handleCloseEditPopup = () => {
        setExibirComponenteEdit(false);
    };

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


    async function handleEdit(productId: string) {
        const productToEdit = products.find((product) => product.id === productId);
        if (productToEdit) {
            setSelectedProduct(productToEdit);
            setExibirComponenteEdit(true);
        }
    }

    async function handleMove(productId: string) {

        const productToEdit = products.find((product) => product.id === productId);
        if (productToEdit) {
            setSelectedProduct(productToEdit);
            setExibirComponenteMove(true);
        }
    }

    async function handleInfo(productId: string) {

        const productGet = products.find((product) => product.id === productId);

        if (productGet) {
            setSelectedProduct(productGet);
            setExibirComponenteInfo(true);
        }
    }

    return (
        <>
            <div className={styles.main}>
                <MainBar />
                <div className={styles.container}>

                    <form className={styles.cadprod}>
                        <h2>Cadastrar Produto</h2>
                        <div className={styles.containerform}>
                            <div className={styles.items}>
                                <SiNamecheap className={styles.img} />
                                <input type="text" placeholder="Nome" className={styles.input} ref={NomeRef} />
                            </div>
                            <div className={styles.items}>
                                <LuDollarSign className={styles.img} />
                                <input type="number" placeholder="Valor" className={styles.input} ref={ValorRef} />
                            </div>
                            <div className={styles.items}>
                                <GoFileDirectory className={styles.img} />
                                <input type="file" accept="image/*" className={styles.input} ref={imageRef} />
                            </div>
                            <div className={styles.items}>
                                <MdOutlineDescription className={styles.img} />
                                <input type="text" placeholder="Descrição" className={styles.input} ref={descRef} />
                            </div>
                            <div className={styles.items}>
                                <FaSortAmountUpAlt className={styles.img} />
                                <input type="number" placeholder="Quantidade" className={styles.input} ref={quatRef} />
                            </div>
                        </div>
                        <button onClick={PostProduto} className={styles.btncadprod}>Confirmar</button>
                    </form>

                    <div className={styles.containermyproducts}>
                        <h2>Meus Produtos</h2>
                        <table className={styles.myproducts}>
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className={styles.header}>Imagem</th>
                                    <th className={styles.header}>Nome</th>
                                    <th className={styles.header}>Preço</th>
                                    <th className={styles.header}>Info</th>
                                </tr>
                            </thead>
                            <tbody className={styles.table}>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className={styles.rowlist}>
                                            <td className={styles.itemslistimg}>
                                                <img src={
                                                    product?.img && typeof product.img === "string" && product.img.startsWith("data:image")
                                                        ? product.img
                                                        : `data:image/png;base64,${product?.img || ""}`
                                                }
                                                    alt={product?.nome || "Produto sem nome"}
                                                    className="h-12 w-12 object-cover" />
                                            </td>
                                            <td className={styles.itemslist}>{product.nome}</td>
                                            <td className={styles.itemslist}>R${product.preco}</td>
                                            <td className="flex justify-center space-x-2 mt-3">
                                                <button onClick={() => handleMove(product.id)} className={styles.btnChoices}>
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleEdit(product.id)} className={styles.btnChoices}>
                                                    <GrConfigure />
                                                </button>
                                                <button onClick={() => handleInfo(product.id)} className={styles.btnChoices}>
                                                    <IoIosInformationCircleOutline />
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
                    {exibirComponenteMove && selectedProduct && <MovePopup nome={selectedProduct.nome} id={selectedProduct.id} preco={0} img={selectedProduct.img} descricao={selectedProduct.descricao} quantidade={selectedProduct.quantidade} onClose={handleCloseMovePopup} />}
                    {exibirComponenteInfo && selectedProduct && <InfoPopup nome={selectedProduct.nome} id={selectedProduct.id} preco={0} img={selectedProduct.img} descricao={selectedProduct.descricao} quantidade={selectedProduct.quantidade} onClose={handleCloseInfoPopup} />}
                    {exibirComponenteEdit && selectedProduct && <EditPopup nome={selectedProduct.nome} id={selectedProduct.id} preco={0} img={selectedProduct.img} descricao={selectedProduct.descricao} quantidade={selectedProduct.quantidade} onClose={handleCloseEditPopup} />}

                </div>
            </div>
            <ModalProducts isOpen={modalOpen} onClosed={handlerModal} data={selectedProduct ? [selectedProduct] : []} />
        </>
    );
};

export default Products;