'use client';

import { useState, useEffect } from 'react';
import Swal from "sweetalert2";

export default function PaymentRegistration() {
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    // Verificar se o método de pagamento está armazenado no localStorage
    useEffect(() => {
        const savedPaymentMethod = localStorage.getItem("paymentMethod");
        if (savedPaymentMethod) {
            setPaymentMethod(savedPaymentMethod);
        }
    }, []);

    const handlePayment = () => {
        if (!paymentMethod) {
            Swal.fire({
                text: "Por favor, selecione um método de pagamento!",
                icon: "warning",
            });
            return;
        }

        // Armazenar o método de pagamento no localStorage
        localStorage.setItem("paymentMethod", paymentMethod);

        Swal.fire({
            text: `Pagamento realizado com sucesso via ${paymentMethod}!`,
            icon: "success",
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Registro de Pagamento</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600">Método de Pagamento</label>
                        <div className="flex flex-col gap-2 mt-2">
                            <button
                                onClick={() => setPaymentMethod("Cartão de Crédito")}
                                className={`p-3 rounded-lg border text-gray-700 ${paymentMethod === "Cartão de Crédito" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                Cartão de Crédito
                            </button>
                            <button
                                onClick={() => setPaymentMethod("Cartão de Débito")}
                                className={`p-3 rounded-lg border text-gray-700 ${paymentMethod === "Cartão de Débito" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                Cartão de Débito
                            </button>
                            <button
                                onClick={() => setPaymentMethod("Pix")}
                                className={`p-3 rounded-lg border text-gray-700 ${paymentMethod === "Pix" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                Pix
                            </button>
                        </div>
                    </div>

                    {paymentMethod === "Cartão de Crédito" || paymentMethod === "Cartão de Débito" ? (
                        <div>
                            <label className="block text-gray-600">Número do Cartão</label>
                            <input
                                type="text"
                                placeholder="Digite o número do cartão"
                                className="w-full p-3 mt-2 border rounded-lg bg-white text-black"
                            />
                        </div>
                    ) : null}

                    {paymentMethod === "Cartão de Crédito" || paymentMethod === "Cartão de Débito" ? (
                        <div>
                            <label className="block text-gray-600">Data de Validade</label>
                            <input
                                type="text"
                                placeholder="MM/AA"
                                className="w-full p-3 mt-2 border rounded-lg bg-white text-black"
                            />
                        </div>
                    ) : null}

                    {paymentMethod === "Cartão de Crédito" || paymentMethod === "Cartão de Débito" ? (
                        <div>
                            <label className="block text-gray-600">Código de Segurança</label>
                            <input
                                type="text"
                                placeholder="Código CVV"
                                className="w-full p-3 mt-2 border rounded-lg bg-white text-black"
                            />
                        </div>
                    ) : null}

                    {paymentMethod === "Pix" ? (
                        <div>
                            <button
                                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
                            >
                                Gerar QRCode
                            </button>
                        </div>
                    ) : null}

                    <div className="mt-6">
                        <button
                            onClick={handlePayment}
                            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Finalizar Pagamento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
