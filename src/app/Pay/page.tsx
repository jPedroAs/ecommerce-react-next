"use client";

import api from "../../services/api"
import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, CardElement } from "@stripe/react-stripe-js";
import "./index.css";
import MainBar from "@/components/MainBar/MainBar";
import { Pedidos } from "@/Types/PedidoInterface";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Link from "next/link";

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
      const responsePedido = await api.get(`/Pedido/${decodedToken.ID}`).then((responsePedido) => {
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

  
  async function PostPagamento (e: React.FormEvent) {
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
    const nome = inputName.current?.value || "";  
    const cpf = inputCPF.current?.value || "";  

    const body = {
      name: nome,
      cpf: cpf,
      Card_token: paymentMethod?.id,
      amount:  Math.round(parseFloat(totalAmount) * 100),
      type_payment: paymentType
    }
    console.log(body)

    const response = await api.post("/Pay", body)
      .then((response) => {
        Swal.fire({
          text: `Compra Realizada com Sucesso. Aqui está o Número do seu Pedido: ${response.data.id}`,
          icon: "success",
        });
        window.location.href = "/Home";
      })
  };


  return (
    <div>
      <MainBar />
      <div className='flex justify-center items-center flex-col bg-white min-h-screen'>
        <div className=" flex justify-center items-center flex-col w-full bg-white rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4  text-black">Resumo do Pedido</h2>
          <ul className="space-y-2">
            {pedido.map((pedido) => (
              <li key={pedido.pedidos.id_pedido} className="flex justify-between gap-4">
                <span className="text-black">{pedido.produtos.nome}</span>
                <span className="text-black">R${pedido.produtos.preco.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="font-semibold text-black">Total: R${totalAmount}</p>
          </div>
        </div>

        <div className="container">
          <h1 className="title">Escolha o tipo de pagamento</h1>
          <div className="payment-type-selection">
            <button onClick={() => handlePaymentTypeSelect("credit")} className="button">
              Cartão de Crédito
            </button>
            <button onClick={() => handlePaymentTypeSelect("debit")} className="button">
              Cartão de Débito
            </button>
          </div>

          {paymentType && (
            <div className="card">
              <h2 className="payment-title">
                Preencha os detalhes do seu {paymentType === "credit" ? "Cartão de Crédito" : "Cartão de Débito"}
              </h2>
              <form onSubmit={PostPagamento} className="form">
                <div className="input-container">
                  <CardElement key={cardNumberKey} options={CARD_OPTIONS} />
                  <input type="text" placeholder="CPF" className="cpf" ref={inputCPF} />
                  <input type="text" placeholder="Nome" className="nome" ref={inputName} />
                </div>

                {/* <div className="input-row"> */}

                {/* <div className="input-container">
                  <label>CVC</label>
                  <CardCvcElement options={CARD_OPTIONS} />
                </div> */}
                {/* </div> */}

                <button type="submit" className="button" disabled={!stripe}>
                  Realizar Pagamento
                </button>
              </form>
              {error && <p className="error">{error}</p>}
              {paymentMethod && <p className="success">PaymentMethod: {paymentMethod}</p>}
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
