import { useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";
import Link from "next/link";
import api from "../../services/api";
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store/authStore';
import { Pedido, Pedidos } from '@/Types/PedidoInterface';
import '../index.css';

interface modal {
  isOpen?: boolean;
  onClosed?: () => void;
}

export default function Cart({ isOpen = false, onClosed }: modal) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pedido, setPedido] = useState<Pedidos[]>([]);

  // Entrada/saída controlada
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10); // ativa transição
    } else if (isMounted) {
      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false); // desmonta após a animação
        onClosed?.();
      }, 500); // tempo da animação
    }
  }, [isOpen]);

  // Carregar produtos
  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchProducts() {
      useAuthStore.getState().loadUserFromCookies();
      const id_user = useAuthStore.getState().user?.ID;

      try {
        const response = await api.get(`/Pedido/${id_user}`);
        const data = response.data.pedido;
        setPedido(Array.isArray(data) ? data : []);
      } catch {
        setPedido([]);
      }
    }

    if (isOpen) {
      fetchProducts();
      interval = setInterval(fetchProducts, 2000);
    }

    return () => clearInterval(interval);
  }, [isOpen]);

  async function handleDelete(productId: number) {
    try {
      await api.delete(`/Pedido/${productId}`);
      setPedido(pedido.filter(product => product.pedidos.id_pedido !== productId));
    } catch {
      Swal.fire({ text: "Erro ao deletar o produto.", icon: "error" });
    }
  }

  async function AtualizarQnt(id: number, qnt: number) {
    try {
      await api.put(`/Pedido/${id}`, { Qbt_prod_unidade: qnt });
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setPedido(prev =>
      prev.map(p =>
        p.pedidos.id_pedido === id
          ? { ...p, pedidos: { ...p.pedidos, qnt_prod_unidade: newQuantity } }
          : p
      )
    );
    AtualizarQnt(id, newQuantity);
  };

  const total = pedido.reduce((sum, p) =>
    sum + (p.produtos.preco * (p.pedidos.qnt_prod_unidade || 1)), 0).toFixed(2);

  if (!isMounted) return null;

  return (
    <div
      className={`
        fixed top-0 right-0 h-screen w-full sm:w-1/3 bg-white shadow-2xl p-6 rounded-lg overflow-y-auto
        transform transition-transform duration-500 ease-in-out z-50
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Carrinho de Compras</h2>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              setIsMounted(false);
              onClosed?.();
            }, 500);
          }}
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full transition duration-200"
        >
          <MdClose />
        </button>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] mb-6">
        {pedido.length > 0 ? (
          pedido.map(product => (
            <div key={product.pedidos.id_pedido} className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center gap-4 hover:bg-gray-100 transition">
              <img src={product.produtos.img} alt={product.produtos.nome} className="w-20 h-20 object-cover rounded-lg" />
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
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          ))
        ) : (
          <p>Sem produtos no carrinho.</p>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center text-lg font-semibold text-gray-800">
        <span>Total:</span>
        <span>R$ {total}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Link
          href="/Pay"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              setIsMounted(false);
              onClosed?.();
            }, 500);
          }}
          className="bg-blue-600 text-white p-3 rounded-lg w-full text-lg hover:bg-blue-700 transition"
        >
          Finalizar Compra
        </Link>
      </div>
    </div>
  );
}
