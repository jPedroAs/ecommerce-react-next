"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/Types/Interface";
import MainBar from "@/components/MainBar/page";

type RatingData = {
  id: number;
  produtoId: string;
  usuarioID: string;
  estrelas: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ratingsData, setRatingsData] = useState<RatingData[]>([]);
  const [averageRatings, setAverageRatings] = useState<{ [key: string]: number }>({});
  const [ratingsCount, setRatingsCount] = useState<{ [key: string]: number }>({});
  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});

  const userId = useAuthStore.getState().user?.ID;

  useEffect(() => {
    const fetchProducts = async () => {
      useAuthStore.getState().loadUserFromCookies();
      const curso = useAuthStore.getState().user?.Curso;
      const universidade = useAuthStore.getState().user?.Universidade;
      try {
        const res = await api.get(`/Produto/Curso/${curso}/${universidade}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    const fetchRatings = async () => {
      try {
        const res = await api.get(`/Avaliacoes`);
        const data: RatingData[] = res.data;
        setRatingsData(data);

        const grouped: { [key: string]: number[] } = {};
        const userRatingsTemp: { [key: string]: number } = {};

        data.forEach((r) => {
          if (!grouped[r.produtoId]) {
            grouped[r.produtoId] = [];
          }
          grouped[r.produtoId].push(r.estrelas);

          if (r.usuarioID === userId) {
            userRatingsTemp[r.produtoId] = r.estrelas;
          }
        });

        const avg: { [key: string]: number } = {};
        const count: { [key: string]: number } = {};

        for (const produtoId in grouped) {
          const total = grouped[produtoId].reduce((a, b) => a + b, 0);
          avg[produtoId] = total / grouped[produtoId].length;
          count[produtoId] = grouped[produtoId].length;
        }

        setAverageRatings(avg);
        setRatingsCount(count);
        setUserRatings(userRatingsTemp);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    };

    fetchProducts();
    fetchRatings();
  }, []);

  const handleRating = async (productId: string, rating: number) => {
    try {
      const payload = {
        produtoId: productId,
        usuarioID: userId,
        estrelas: rating,
      };

      await api.post("/Avaliacoes", payload);

      // Atualizar localmente
      const updatedRatings = [...ratingsData, payload];
    //   setRatingsData(updatedRatings);

      const ratingsForProduct = updatedRatings.filter((r) => r.produtoId === productId);
      const total = ratingsForProduct.reduce((acc, cur) => acc + cur.estrelas, 0);
      const avg = total / ratingsForProduct.length;

      setAverageRatings((prev) => ({ ...prev, [productId]: avg }));
      setRatingsCount((prev) => ({ ...prev, [productId]: ratingsForProduct.length }));
      setUserRatings((prev) => ({ ...prev, [productId]: rating }));
    } catch (error) {
      console.error("Erro ao registrar avaliação:", error);
    }
  };

  return (
    <div>
      <MainBar />
      <div className="flex flex-col bg-gray-100 px-4 pt-10 min-h-screen">
        <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Produtos</h2>
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => {
              const avgRating = averageRatings[product.id] || 0;
              const count = ratingsCount[product.id] || 0;
              const userRating = userRatings[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.nome}</h3>
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
                  <p className="text-sm text-gray-500 mb-4">{product.descricao}</p>

                  <div className="flex space-x-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                          star <= Math.round(avgRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Média: {avgRating.toFixed(1)} estrelas ({count} avaliações)
                  </p>

                  <div className="flex items-center space-x-1 mt-2">
                    <span className="text-sm text-gray-700">Sua avaliação:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(product.id, star)}
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={`w-5 h-5 ${
                            star <= userRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
