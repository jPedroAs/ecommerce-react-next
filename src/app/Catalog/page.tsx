"use client";
import styles from "./catalog.module.css";
import MainBar from "@/components/MainBar/page";
import SearchBox from "@/components/SearchBox/page";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/Types/Interface";
import router from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Catalog = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let res;
        if (query === "") {
          res = await api.get(`/Produto`);
        } else {
          res = await api.get(`Produto/Name/${query}`);
        }
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
    useAuthStore.getState().loadUserFromCookies();
    const id_user = useAuthStore.getState().user?.ID;

    const data = {
      id_produto: produto.id,
      vl_prod_unidade: produto.preco,
      qbt_prod_unidade: 1,
      status_pedido: 1,
      id_category: 1,
      id_aluno: id_user
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

  async function handleButtonClick(id: string) {
    // Redireciona para a página de produtos com o ID do produto
    router.push(`/ShowProd?id=${id}`);
  }

  return (
    <>
      <main className={styles.main}>
        <MainBar />
        <div className={styles.casing}>
          <SearchBox query={query} setQuery={setQuery} />
        </div>

        <div className={styles.container}>
          {loading ? (
            <div className={styles.none}><h1>Procurando...</h1></div>
          ) : (
            <>
              {products.map((product) => (
                <div key={product.id} className={styles.content} onClick={() => handleButtonClick(product.id)}>
                  <img
                    src={
                      product?.img && typeof product.img === "string" && product.img.startsWith("data:image")? product.img: `data:image/png;base64,${product?.img || ""}`} alt={product?.nome || "Produto sem nome"}/>
                  <div>
                    <h1>{product.nome}</h1>
                    <p>R$ {product.preco}</p>
                  </div>
                  <button onClick={() => PostPedido(product)}>Comprar</button>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Catalog;