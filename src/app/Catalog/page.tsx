"use client";

import styles from "./catalog.module.css";
import MainBar from "@/components/MainBar/page";
import SearchBox from "@/components/SearchBox/page";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/Types/Interface";
import { useRouter } from "next/navigation"; // Importe o useRouter do 'next/navigation' (para Next.js 13 e superior) ou 'next/router' (para versões anteriores)
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import Swal from "sweetalert2";
import { useProdutoStore } from "@/store/produtoStore";
import Footer from '@/components/Footer/Footer';

const Catalog = () => {
  const router = useRouter(); // Inicialize o roteador usando o hook
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const setProduto = useProdutoStore((state) => state.setProduto);

  useEffect(() => {
    const fetchProducts = async () => {
      useAuthStore.getState().loadUserFromCookies();
      const curso = useAuthStore.getState().user?.Curso;
      const universidade = useAuthStore.getState().user?.Universidade;
      console.log(curso)
      setLoading(true);
      try {
        let res;
        if (query === "") {
          res = await api.get(`/Produto/Curso/${curso}/${universidade}`);
        } else {
          res = await api.get(`Produto/Name/${query}/${curso}/${universidade}`);
        }
        const data = await res.data;
        setProducts(data);
      } catch (error) {
        console.error("Erro na requisição de produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  useEffect(() => {
    const fetchFavorito = async () => {
        useAuthStore.getState().loadUserFromCookies();
        const id = useAuthStore.getState().user?.ID;
        await api.get(`Favorito/${id}`)
        .then((responsse) => {
          setFavorites(responsse.data.productIds);
        })
    };

    fetchFavorito();
  }, []);

  async function PostPedido(produto: Product) {
    useAuthStore.getState().loadUserFromCookies();
    const id_user = useAuthStore.getState().user?.ID;
    const curso = useAuthStore.getState().user?.Curso;
    const universidade = useAuthStore.getState().user?.Universidade;

    const data = {
      id_produto: produto.id,
      vl_prod_unidade: produto.preco,
      qbt_prod_unidade: 1,
      status_pedido: 1,
      id_category: 1,
      id_aluno: id_user,
      curso: curso,
      universidade: universidade
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

  async function handleButtonClick(id: string) {
    setProduto(id)
    // Redireciona para a página de produtos com o ID do produto
    router.push(`/ShowProd`);
  }
  const toggleFavorite = async (productId: string) => {
    useAuthStore.getState().loadUserFromCookies();
    const userId = useAuthStore.getState().user?.ID;
    if (!userId) return;

    const isAlreadyFavorite = favorites.includes(productId);
    try {
      if (isAlreadyFavorite) {
        await api.post(`/Favorito/${userId}/${productId}/remove`);
        setFavorites(favorites.filter((id) => id !== productId));
      } else {
        await api.post(`/Favorite/${userId}/${productId}/add`);
        setFavorites([...favorites, productId]);
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <MainBar />
        <div className={styles.casing}>
          <SearchBox query={query} setQuery={setQuery} />
        </div>

        <div className={styles.container} >
          {loading ? (
            <div className={styles.none}><h1>Procurando...</h1></div>
          ) : (
            <>
              {products.map((product) => {
                const productIdString = String(product.id).trim();
                // const isFavorite = favorites.some(favId => favId.trim() === productIdString);
                const isFavorite = favorites.includes(String(product.id));
                console.log(`Produto ID: ${productIdString}, Favoritos: ${favorites}, Está favoritado: ${isFavorite}`);
                return (
                  <div key={product.id} className={styles.content}>
                    <img
                      src={
                        product?.img && typeof product.img === "string" && product.img.startsWith("data:image")
                          ? product.img
                          : `data:image/png;base64,${product?.img || ""}`
                      }
                      alt={product?.nome || "Produto sem nome"}
                    onClick={() => handleButtonClick(product.id)}/>
                    <div>
                      <h1>{product.nome}</h1>
                      <p>R$ {product.preco}</p>
                    </div>
                    <div className={styles.btnbox}>
                      <button onClick={() => PostPedido(product)}>Comprar</button>
                      <AiFillStar
                        className={styles.i}
                        fill={isFavorite ?  "yellow" : "#D9D9D9"}
                        onClick={() => toggleFavorite(String(product.id))}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      
      </main>
      <Footer />
    </>
  );
};

export default Catalog;
