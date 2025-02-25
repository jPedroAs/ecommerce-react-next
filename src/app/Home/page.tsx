"use client"
import '../Home/index.css'
import Navbar from "../../components/NavBar";
import { useEffect, useState } from "react";
import api from "../../services/api"
import { Product } from "../../interface/ProdutoInterface"

function Home() {
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

  return (
    <div className='block bg-white min-h-screen'>
      <Navbar />
      <div className="container mx-auto py-10 flex flex-col h-full">
        <h2 className="text-center text-2xl font-bold mb-6">Nossos Produtos</h2>
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
              <h3 className="text-lg font-semibold mt-4">{product.nome}</h3>
              <p className="text-blue-600 font-bold">`R$ {product.preco}`</p>
              <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;