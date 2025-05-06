"use client";
import MainBar from "@/components/MainBar/page";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/Types/Interface";
import { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import Swal from "sweetalert2";
import Footer from '@/components/Footer/Footer';

const Fav = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            useAuthStore.getState().loadUserFromCookies();
            const userId = useAuthStore.getState().user?.ID;

            if (!userId) return;

            try {
                const favoritesRes = await api.get(`/Favorito/${userId}`);
                const favIds = favoritesRes.data.productIds

                setFavorites(favIds);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
                setFavorites([]);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (favorites.length === 0) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                console.log(favorites)
                const promises = favorites.map((id) =>
                    api.get(`/Produtos/ID/${id}`).then((res) => res.data)

                );



                const results = await Promise.all(promises);
                const produtos = results.flat(); // ou apenas results, se o retorno for único
                setProducts(produtos);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [favorites]);

    const removeFavorite = async (productId: string) => {
        const userId = useAuthStore.getState().user?.ID;
        if (!userId) return;

        try {
            await api.post(`/Favorito/${userId}/${productId}/remove`);
            setFavorites((prev) => prev.filter((id) => id !== productId));
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
        }
    };

    async function PostPedido(produto: Product) {
        useAuthStore.getState().loadUserFromCookies();
        const id_user = useAuthStore.getState().user?.ID;

        const data = {
            id_produto: produto.id,
            vl_prod_unidade: produto.preco,
            qbt_prod_unidade: 1,
            status_pedido: 1,
            id_category: 1,
            id_aluno: id_user
        };

        try {
            await api.post("/Pedido", data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Adicionado no Carrinho",
                showConfirmButton: false,
                timer: 1500
            });
        } catch {
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Item já foi adicionado no Carrinho",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <MainBar />
            <div className="p-4 max-w-4xl mx-auto">
                {loading ? (
                    <h1 className="text-center text-xl font-semibold">Carregando favoritos...</h1>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                        {products.length === 0 ? (
                            <p className="text-center text-gray-500">Você ainda não tem produtos favoritados.</p>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} className="border-b pb-4 last:border-b-0">
                                    <h3 className="text-lg font-bold">{product.nome}</h3>
                                    <img
                                        className="w-32 h-32 object-cover rounded-md mb-4"
                                        src={
                                            product?.img &&
                                                typeof product.img === "string" &&
                                                product.img.startsWith("data:image")
                                                ? product.img
                                                : `data:image/png;base64,${product?.img || ""}`
                                        }
                                        alt={product?.nome || "Produto sem nome"}
                                    />
                                    <p className="text-gray-600">{product.descricao}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-green-600 font-semibold">R$ {product.preco}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => PostPedido(product)}
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-md text-sm"
                                            >
                                                Adicionar ao carrinho
                                            </button>
                                            <button
                                                onClick={() => removeFavorite(String(product.id))}
                                                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md text-sm"
                                            >
                                                <AiFillStar className="text-red-500" /> Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <Footer />

        </main>
    );
};

export default Fav;
