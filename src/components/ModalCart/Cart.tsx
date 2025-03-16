import { Product } from '@/Types/ProdutoInterface';
import '../index.css';
import { useEffect, useState } from 'react';
import api from "../../services/api";
import Swal from 'sweetalert2';
import { MdClose } from "react-icons/md";
import { Pedido, Pedidos } from '@/Types/PedidoInterface';
import { jwtDecode } from 'jwt-decode';
import Link from "next/link";
interface modal {
    isOpen?: boolean,
    onClosed?: () => void
}

export default function Cart({ isOpen, onClosed }: modal) {
    const [isVisible, setIsVisible] = useState(false);
    // const [products, setProducts] = useState<Product[]>([]);
    const [pedido, setPedido] = useState<Pedidos[]>([]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        async function fetchProducts() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token não encontrado.");
                return;
            }
            let decodedToken: any;
            try {
                decodedToken = jwtDecode(token);
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                return;
            }
            const responsePedido = await api.get(`/Pedido/${decodedToken.ID}`).then((responsePedido) => {
                if (Array.isArray(responsePedido.data.pedido)) {
                    const data = responsePedido.data.pedido;
                    setPedido(data);
                } else {
                    setPedido([]);
                }
            }).catch(() => { 
                setPedido([]);  
            })
        }
        if (isOpen) {
            fetchProducts();
            interval = setInterval(fetchProducts, 2000);
        }

        return () => clearInterval(interval);
    }, [isOpen]);

    async function handleDelete(productId: number) {
        try {
            console.log(productId)
            const response = await api.delete(`/Pedido/${productId}`);
            console.log(response)
            setPedido(pedido.filter(product => product.pedidos.id_pedido !== productId));
        } catch (error) {
            Swal.fire({
                text: "Erro ao deletar o produto.",
                icon: "error",
            });
        }
    }

    async function AtualizarQnt(id: number, qnt: number) {
        try {
            const data = {
                Qbt_prod_unidade: qnt
            }
            const response = await api.put(`/Pedido/${id}`, data);

            if (response.status === 200) {
                console.log("Atualização bem-sucedida!");
            }
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
        }
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setPedido(prevPedido =>
            prevPedido.map(pedido =>
                pedido.pedidos.id_pedido === id
                    ? { ...pedido, pedidos: { ...pedido.pedidos, qnt_prod_unidade: newQuantity } }
                    : pedido
            )
        );
        AtualizarQnt(id, newQuantity);
    };


    const total = Array.isArray(pedido) ? pedido.reduce((sum, pedido) => sum + (pedido.produtos.preco * (pedido.pedidos.qnt_prod_unidade || 1)), 0).toFixed(2) : '0.00';

    if (!isOpen && !isVisible) return null;

    return (
        <div
            className={`fixed top-0 right-0 h-screen w-1/3 bg-white shadow-2xl p-6 rounded-lg overflow-y-auto
                transition-transform duration-500 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`} style={{ zIndex: 1 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Carrinho de Compras</h2>
                <button
                    onClick={onClosed}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition duration-200">
                    <MdClose />
                </button>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] mb-6">
                {pedido.length > 0 ? (
                    pedido.map((product) => (
                        <div key={product.pedidos.id_pedido} className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center gap-4 transition duration-200 hover:bg-gray-100">
                            <img
                                src={product.produtos.img}
                                alt={product.produtos.nome}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex flex-col flex-grow">
                                <span className="text-lg font-semibold text-gray-800">{product.produtos.nome}</span>
                                <span className="text-gray-600">R$ {product.produtos.preco.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={product.pedidos.qnt_prod_unidade || 1}
                                    onChange={(e) => handleQuantityChange(product.pedidos.id_pedido, parseInt(e.target.value))}
                                    min="1"
                                    className="w-16 p-2 rounded-lg border border-gray-300 text-center bg-white text-black"
                                />
                            </div>

                            <button
                                onClick={() => handleDelete(product.pedidos.id_pedido)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200">
                                Excluir
                            </button>
                        </div>
                    ))) : (
                    <p>Sem produtos no carrinho.</p> // Caso 'pedido' não seja um array ou esteja vazio
                )}
            </div>

            <div className="mt-6 flex justify-between items-center text-lg font-semibold text-gray-800">
                <span>Total:</span>
                <span>R$ {total}</span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <Link
                    href="/Pay"
                    onClick={onClosed}
                    className="bg-blue-600 text-white p-3 rounded-lg w-full text-lg hover:bg-blue-700 transition duration-200" >
                    Finalizar Compra
                </Link>
            </div>
        </div>
    );
}
