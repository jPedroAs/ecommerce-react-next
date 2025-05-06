'use client';

import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import { Pedidos } from '@/Types/PedidoInterface';
import MainBar from '@/components/MainBar/page';
import { useAuthStore } from '@/store/authStore';
import Footer from '@/components/Footer/Footer';

const HistoricoCompras = () => {
    const [pedidos, setPedidos] = useState<Pedidos[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            useAuthStore.getState().loadUserFromCookies();
            const id = useAuthStore.getState().user?.ID;
            console.log(id)
            try {
                const response = await api.get(`/Pedido-transacao/${id}`);
                console.log(response.data.pedido)
                setPedidos(response.data.pedido);
                setLoading(false)
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    return (
        <div>
            <MainBar />
            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-3xl font-bold mb-6 text-black text-center">Histórico de Compras</h1>

                {loading ? (
                    <p className="text-gray-600 text-center">Carregando pedidos...</p>
                ) : pedidos.length === 0 ? (
                    <p className="text-gray-600 text-center">Nenhum pedido encontrado.</p>
                ) : (
                    <div className="space-y-4 max-w-5xl mx-auto">
                        {pedidos.map((pedido, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 border border-transparent hover:border-[#00CED1] transition-all duration-300 text-black"
                            >
                                <p className="text-lg font-semibold">
                                    Pedido #{pedido.pedidos.id_pedido}
                                </p>

                                <div className="flex items-center gap-3">
                                    <img
                                        src={pedido.produtos.img}
                                        alt={pedido.produtos.nome}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700">{pedido.produtos.nome}</span>
                                        <span className="text-sm text-gray-500">R$ {pedido.pedidos.vl_prod_unidade.toFixed(2)}</span>
                                        <span className="text-sm text-gray-500">Quantidade Comprada {pedido.pedidos.qnt_prod_unidade}</span>
                                    </div>
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

export default HistoricoCompras;
