"use client"

import { Product } from "@/Types/ProdutoInterface";
import { useState, useEffect } from "react";
import api from "../../services/api"
import MainBar from "@/components/MainBar/MainBar";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query === "") {
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`Produto/Name/${query}`);
        const data = await res.data;
        setProducts(data);
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);


   async function PostPedido(produto: Product) {
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
  
      const data = {
        id_produto: produto.id,
        vl_prod_unidade: produto.preco,
        qbt_prod_unidade: 1,
        status_pedido: 1,
        id_category: 1,
        id_aluno: decodedToken.ID
      }
      console.log(data)
      const response = await api.post("/Pedido", data)
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Adicionado no Carrinho",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(() => {
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Item já foi adicionado no Carrinho",
          showConfirmButton: false,
          timer: 1500
        });
      });
      console.log(response)
  
    }

  return (
    <div className='block bg-white min-h-screen'>
      <MainBar />
      <div className="container mx-auto py-10 flex flex-col h-full">
        <h2 className="text-center text-2xl font-bold mb-6">Nossos Produtos</h2>
      <input
        type="text"
        placeholder="Digite o nome do produto"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black bg-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? (
        <div className="text-center text-gray-500">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={
                product?.img && typeof product.img === "string" && product.img.startsWith("data:image")
                  ? product.img
                  : `data:image/png;base64,${product?.img || ""}`
              }
              alt={product?.nome || "Produto sem nome"}
              className="h-12 w-12 object-cover" />
            <h3 className="text-lg font-semibold mt-4 text-black">{product.nome}</h3>
            <p className="text-blue-600 font-bold">R$ {product.preco}</p>
            <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => PostPedido(product)}>
              Comprar
            </button>
          </div>
        ))}
      </div>
      )}
       </div>
    </div>
  );
};

export default SearchPage;
