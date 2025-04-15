"use client";

import api from "../../services/api"
import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./index.css";
import MainBar from "@/components/MainBar/page";
import { Pedidos } from "@/Types/PedidoInterface";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";

const stripePromise = loadStripe("pk_test_51Qz3IoFY2T2EW3rQl4qfXPbjp27xZK9vlCMl9pIBvdJd6UfPhpH18FYMIQxWvKWjy0yfM2ea0wLeqHZufFASXMyo0060uTKfRP");

const CARD_OPTIONS = {
  style: {
    base: {
      display: "block",
      fontSize: "16px",
      color: "#17171c",
      "::placeholder": { color: "#3c4249" },
      letterSpacing: "0.025em",
      padding: "10px",
      borderRadius: "8px", // Adicionando borda arredondada
      border: "1px solid #ccc", // Borda padrão
    },
    invalid: {
      color: "#fa755a",
    },
  },
  disableLink: true,
};

const CheckoutForm = () => {

  const inputName = useRef<HTMLInputElement>(null);
  const inputCPF = useRef<HTMLInputElement>(null);


  const stripe = useStripe();
  const [pedido, setPedido] = useState<Pedidos[]>([]);
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [cardNumberKey, setCardNumberKey] = useState(0);

  const handlePaymentTypeSelect = (type: string) => {
    setPaymentType(type);
  };

  useEffect(() => {
    setCardNumberKey(prevKey => prevKey + 1);
  }, [paymentType]);

  useEffect(() => {
    async function fetchProducts() {
      useAuthStore.getState().loadUserFromCookies();
      const id_user = useAuthStore.getState().user?.ID;
      const responsePedido = await api.get(`/Pedido/${id_user}`).then((responsePedido) => {
        if (Array.isArray(responsePedido.data.pedido)) {
          const data = responsePedido.data.pedido;
          setPedido(data);
        } else {
          setPedido([]);
        }
      }).catch(() => {
        setPedido([]);
      })
    }
    fetchProducts();
  }, []);

  const totalAmount = Array.isArray(pedido) ? pedido.reduce((sum, pedido) => sum + (pedido.produtos.preco * (pedido.pedidos.qnt_prod_unidade || 1)), 0).toFixed(2) : '0.00';


  async function PostPagamento(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe não foi carregado.");
      return;
    }

    // const cardNumberElement = elements.getElement(CardNumberElement);
    // const cardExpiryElement = elements.getElement(CardExpiryElement);
    // const cardCvcElement = elements.getElement(CardCvcElement);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Erro ao obter o campo do cartão.");
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log(error)
    }
    useAuthStore.getState().loadUserFromCookies();
    const id_user = useAuthStore.getState().user?.ID;

    const nome = inputName.current?.value || "";
    const cpf = inputCPF.current?.value || "";

    const body = {
      name: nome,
      cpf: cpf,
      Card_token: paymentMethod?.id,
      amount: Math.round(parseFloat(totalAmount) * 100),
      type_payment: paymentType,
      id_user: id_user
    }
    console.log(body)

    const response = await api.post("/Pay", body)
      .then((response) => {
        Swal.fire({
          title: "Pagamento Realizado!",
          text: `Compra Realizada com Sucesso. Aqui está o Número do seu Pedido: ${response.data.id}`,
          icon: "success",
          confirmButtonText: "OK",
          willClose: () => {
            window.location.href = "/Catalog";
          }
        });
      })

  };


  return (
    <div>
      <MainBar />
      <div className="flex  flex-col bg-gray-100 px-4 pt-10 min-h-screen">

        <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Resumo do Pedido</h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {pedido.map((pedido) => (
              <li key={pedido.pedidos.id_pedido} className="flex justify-between py-2">
                <span className="text-gray-700">{pedido.produtos.nome}</span>
                <span className="text-gray-800 font-medium">R${pedido.produtos.preco.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right font-semibold text-gray-900">
            Total: R${totalAmount}
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mb-16">
          <h1 className="text-xl font-semibold mb-4 text-gray-800 text-center">Escolha o tipo de pagamento</h1>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handlePaymentTypeSelect("credit")}
              className={`px-4 py-2 rounded-lg border font-medium shadow-sm transition 
          ${paymentType === "credit" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
            >
              Cartão de Crédito
            </button>
            <button
              onClick={() => handlePaymentTypeSelect("debit")}
              className={`px-4 py-2 rounded-lg border font-medium shadow-sm transition 
          ${paymentType === "debit" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
            >
              Cartão de Débito
            </button>
          </div>

          {paymentType && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">
                Preencha os dados do seu {paymentType === "credit" ? "Cartão de Crédito" : "Cartão de Débito"}
              </h2>
              <form className="space-y-4" onSubmit={PostPagamento}>
                <div className="space-y-4">
                  <CardElement key={cardNumberKey} options={CARD_OPTIONS} />
                  <input
                    type="text"
                    placeholder="CPF"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    ref={inputCPF}
                  />
                  <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
                    ref={inputName}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                  disabled={!stripe}
                >
                  Realizar Pagamento
                </button>
              </form>
              {error && <p className="text-red-600 mt-2 text-sm text-center">{error}</p>}
              {paymentMethod && <p className="text-green-600 mt-2 text-sm text-center">Pagamento criado com sucesso</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
