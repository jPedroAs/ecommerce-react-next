'use client';
import Footer from "@/components/Footer/Footer";
import MainBar from "@/components/MainBar/page";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { PedidoInfo } from "@/Types/Infos_Pedidos";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";


const OrdersPage = () => {
    const [pedidos, setPedidos] = useState<PedidoInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            useAuthStore.getState().loadUserFromCookies();
            const curso = useAuthStore.getState().user?.Curso;
            const universidade = useAuthStore.getState().user?.Universidade;
            try {
                const response = await api.get(`/Pedido-retirada/${curso}/${universidade}`);

                if (response.data && response.data.pedidos_Infos) {
                    setPedidos(response.data.pedidos_Infos);
                } else {
                    setPedidos([]);
                }
                setLoading(false)
            } catch (error) {
                setPedidos([]);
                setLoading(false)
            }
        };

        fetchPedidos();
    }, []);

    const confirmOrder = async (id: number) => {
        await api.put(`/Pedido-retirada/${id}`).then((response) => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Pedido Retirado",
                showConfirmButton: false,
                timer: 1500
            }).then(() => window.location.reload());
        })
    };

    const cancelOrder = (id: string) => {
        console.log("Cancelar pedido:", id);
    };


    return (
        <div>
            <MainBar />
            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-3xl font-bold mb-6 text-black text-center">Pedidos Para Serem Retirados</h1>

                {loading ? (
                    <p className="text-gray-600 text-center">Carregando pedidos...</p>
                ) : pedidos.length === 0 ? (
                    <p className="text-gray-600 text-center">Nenhum pedido encontrado.</p>
                ) : (
                    <div className="space-y-7 max-w-6xl mx-auto">
                        {pedidos.map((p) => (
                            <div
                                key={p.pedidos.id_Pedido}
                                className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 border border-transparent hover:border-[#00CED1] transition-all duration-300 text-black"
                            >
                                <p className="text-lg font-semibold">
                                    Pedido #{p.pedidos.id_Pedido}
                                </p>

                                <div className="flex items-center gap-4">
                                    {p.produtos.img && (
                                        <img
                                            src={p.produtos.img}
                                            alt={p.produtos.nome}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex flex-col ">
                                        <span className="text-sm font-medium text-gray-700">
                                            {p.produtos.nome}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            R$ {p.pedidos.vl_prod_unidade.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Quantidade Comprada: {p.pedidos.qnt_prod_unidade}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Status da Retirada: {p.pedidos.checkout == 1 ? "Pendente" : "Retirado"}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Data da Compra: {new Date(p.pedidos.data_pedido).toLocaleDateString('pt-BR')}
                                        </span>

                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700">
                                            Comprador: {p.users.nome}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            RA: {p.users.ra}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Telefone: {p.users.telefone}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => confirmOrder(p.pedidos.id_Pedido)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                                    >
                                        Retirado
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

        </div>
    );
};

export default OrdersPage;
