"use client";

import MainBar from "@/components/MainBar/page";
import styles from "./ShowProd.module.css";
import api from "@/services/api";
import { Product } from "@/Types/Interface";
import { useState, useEffect, useRef } from "react";
import { FaRegStar } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { SlSizeActual } from "react-icons/sl";
import { useAuthStore } from "@/store/authStore";
import Swal from "sweetalert2";
import { useProdutoStore } from "@/store/produtoStore";

const ShowProd = () => {
  const produto = useProdutoStore((state) => state.produto);
  const [id, setId] = useState<string | null>(null); // Usando estado local para o id
  const qtdProd = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    // Verifica se está no cliente (navegador) antes de acessar `produto`
    if (typeof window !== 'undefined' && produto) {
      setId(produto); // Define o id com o valor do produto no localStorage
    }
  }, [produto]);

  useEffect(() => {
    if (id) {
      const fetchProductById = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/Produtos/ID/${id}`);
          const data: Product = res.data[0];
          setProduct(data);
        } catch (error) {
          console.error("Erro na requisição:", error);
        } finally {
          setLoading(false);
        }
      };

      const fetchStockProductById = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/Estoques/${id}`);
          const stockData = res.data;
          setQuantity(stockData.quantidade);
        } catch (error) {
          console.error("Erro na requisição:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductById();
      fetchStockProductById();
    }
  }, [id]);

  async function PostPedido(produto: Product) {
    useAuthStore.getState().loadUserFromCookies();
    const id_user = useAuthStore.getState().user?.ID;
    const QuantiProd = qtdProd.current?.value;

    const data = {
      id_produto: produto.id,
      vl_prod_unidade: produto.preco,
      qbt_prod_unidade: QuantiProd,
      status_pedido: 1,
      id_category: 1,
      id_aluno: id_user
    };

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
    console.log(response);
  }

  return (
    <>
      <MainBar />
      <main className={styles.main}>
        <div className={styles.container}>
          {product ? (
            <>
              <img src={product.img} alt="" />
              <div className={styles.content}>
                <h2>ID - {product.id}</h2>
                <h2>Categoria do Produto - {product.categoria}</h2>
                <h1>{product.nome}</h1>
                <div className={styles.casing}>
                  <h1>R$ {product.preco}</h1>
                  {/* <div className={styles.line}></div> */}
                  {/* <div className={styles.box}>
                    <FaRegStar className={styles.star} />
                    <FaRegStar className={styles.star} />
                    <FaRegStar className={styles.star} />
                    <FaRegStar className={styles.star} />
                    <FaRegStar className={styles.star} />
                  </div> */}
                  {/* <div className={styles.line}></div> */}
                  {/* <p>{product.qAval} Reviews</p> */}
                </div>
                <p>{product.descricao}</p>
                <div className={styles.buy}>
                  <div className={styles.info}>
                    <div>
                      <input type="text" placeholder="Selecione a Quantidade" ref={qtdProd} />
                      <div><IoAdd className={styles.i} /></div>
                    </div>
                  </div>
                  <div className={styles.btn}>
                    <button onClick={() => PostPedido(product)}>Adicionar ao Carrinho</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Carregando</p>
          )}
        </div>
      </main>
    </>
  );
};

export default ShowProd;
