import { Product } from '@/interface/ProdutoInterface';
import '../index.css';
import { useEffect, useState } from 'react';
import api from "../../services/api";
import Swal from 'sweetalert2';
import { MdClose } from "react-icons/md";

interface modal {
    isOpen?: boolean,
    onClosed?: () => void
}

export default function Cart({ isOpen, onClosed }: modal) {
    const [isVisible, setIsVisible] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get(`/Produto`);
                const data = await response.data;
                setProducts(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        }
        fetchProducts();
    }, []);

    async function handleDelete(productId: string) {
        try {
            console.log(productId)
            const response = await api.delete(`/Produto/${productId}`);
            console.log(response)
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            Swal.fire({
                text: "Erro ao deletar o produto.",
                icon: "error",
            });
        }
    }

    const handleQuantityChange = (id: string, newQuantity: number) => {
        setProducts(prevProducts => 
            prevProducts.map(product =>
                product.id === id ? { ...product, quantidade: newQuantity } : product
            )
        );
    };

    const total = products.reduce((sum, product) => sum + (product.preco * (product.quantidade || 1)), 0).toFixed(2);

    if (!isOpen && !isVisible) return null;

    return (
        <div
            className={`fixed top-0 right-0 h-screen w-1/3 bg-white shadow-2xl p-6 rounded-lg overflow-y-auto
                transition-transform duration-500 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Carrinho de Compras</h2>
                <button
                    onClick={onClosed}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition duration-200">
                    <MdClose />
                </button>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] mb-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center gap-4 transition duration-200 hover:bg-gray-100">
                        <img
                            src={product.img}
                            alt={product.nome}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex flex-col flex-grow">
                            <span className="text-lg font-semibold text-gray-800">{product.nome}</span>
                            <span className="text-gray-600">R$ {product.preco.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={product.quantidade ||1}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                min="1"
                                className="w-16 p-2 rounded-lg border border-gray-300 text-center bg-white text-black"
                            />
                        </div>

                        <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200">
                            Excluir
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center text-lg font-semibold text-gray-800">
                <span>Total:</span>
                <span>R$ {total}</span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <button
                    onClick={onClosed}
                    className="bg-blue-600 text-white p-3 rounded-lg w-full text-lg hover:bg-blue-700 transition duration-200">
                    Finalizar Compra
                </button>
            </div>
        </div>
    );
}
