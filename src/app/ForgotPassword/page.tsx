"use client";
import { useRef, useState } from "react";
import { FaRegIdCard } from "react-icons/fa";
import styles from "./ForgotPassword.module.css";
import api from "@/services/api";
import Swal from "sweetalert2";

const ForgotPassword = () => {
    const inputNewPassword = useRef<HTMLInputElement>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null);

    const [ra, setRA] = useState("");
    const [code, setCode] = useState("");
    const [inputHeight, setInputHeight] = useState(66);
    const [clickCount, setClickCount] = useState(0);
    const [showInputs, setShowInputs] = useState(false);
    const [button, setButton] = useState("Send E-mail");

    const handleButtonClick = async () => {
        if (clickCount === 0) {
            setButton("Confirm Code");
            await PostSendEmail();
            setClickCount(1);
        } else if (clickCount === 1) {
            const isValid = await CheckToken();

            if (isValid) {
                setShowInputs(true);
                setInputHeight(153);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Token inválido",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    async function PostSendEmail() {
        const data = { ra };
        console.log("Dados enviados para PostSendEmail:", data);

        try {
            const response = await api.post("/Esqueci-Senha", data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Email enviado com sucesso",
                showConfirmButton: false,
                timer: 1500
            });
            console.log(response);
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Erro ao enviar o email",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        }
    }

    async function CheckToken(): Promise<boolean> {
        try {
            const response = await api.get(`/Token-Senha/${code}`);
            console.log("Resposta da verificação do token:", response.data);
            return response.data === true; // Ajuste conforme a resposta real da sua API
        } catch (error) {
            console.error("Erro ao verificar o token:", error);
            return false;
        }
    }

    async function PatchSendCode() {
        const newPassword = inputNewPassword.current?.value;
        const confirmPassword = inputConfirmPassword.current?.value;

        if (newPassword !== confirmPassword) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "As senhas não coincidem",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const data = {
            token: code,
            novaSenha: newPassword
        };

        console.log("Dados enviados para PatchSendCode:", data);
        try {
            const response = await api.patch("/Senha-Nova", data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Senha alterada com sucesso",
                showConfirmButton: false,
                timer: 1500
            });
            console.log(response);
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Erro ao alterar a senha",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>Forgot Password</h1>
                    <div className={styles.input} style={{ height: `${inputHeight}px` }}>
                        {clickCount === 0 && !showInputs && (
                            <div className={styles.casing}>
                                <div><FaRegIdCard /></div>
                                <input
                                    type="text"
                                    placeholder="RA"
                                    value={ra}
                                    onChange={(e) => setRA(e.target.value)}
                                />
                            </div>
                        )}
                        {clickCount === 1 && !showInputs && (
                            <div className={styles.casing}>
                                <div><FaRegIdCard /></div>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        )}
                        {showInputs && (
                            <>
                                <div className={styles.casing}>
                                    <div><FaRegIdCard /></div>
                                    <input type="password" placeholder="New Password" ref={inputNewPassword} />
                                </div>
                                <div className={styles.casing}>
                                    <div><FaRegIdCard /></div>
                                    <input type="password" placeholder="Confirm Password" ref={inputConfirmPassword} />
                                </div>
                            </>
                        )}
                    </div>
                    {!showInputs ? (
                        <>
                            <p>Preencha o campo acima e nós enviaremos um código para o seu e-mail.</p>
                            <button onClick={handleButtonClick}>{button}</button>
                        </>
                    ) : (
                        <>
                            <p>Preencha os campos acima para definir sua nova senha.</p>
                            <button onClick={PatchSendCode}>Redefinir Senha</button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
