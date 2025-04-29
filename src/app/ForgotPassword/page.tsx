"use client";
import { useRef, useState } from "react";
import { FaRegIdCard } from "react-icons/fa";
import styles from "./ForgotPassword.module.css";
import { ResetPassword } from "@/Types/Interface";
import api from "@/services/api";
import Swal from "sweetalert2";

const ForgotPassword = () => {
    const inputNewPassword = useRef<HTMLInputElement>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [inputHeight, setInputHeight] = useState(66);
    const [clickCount, setClickCount] = useState(0);
    const [showInputs, setShowInputs] = useState(false);
    const [button, setButton] = useState("Send E-mail");

    const handleButtonClick = async () => {
        setClickCount(prevCount => prevCount + 1);

        if (clickCount === 0) {
            setButton("Confirm Code");
            await PostSendEmail();
        } else if (clickCount === 1) {
            setShowInputs(true);
            setInputHeight(153); // Prepare altura para o campo de código
        }
    };

    async function PostSendEmail() {
        const data = {
            email: email
        };

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
            email: email,
            ResetCode: code,
            NewPassword: newPassword
        };

        console.log("Dados enviados para PostSendCode:", data);
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
        <>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <h1>Forgot Password</h1>
                        <div className={styles.input} style={{ height: `${inputHeight}px` }}>
                            <div className={styles.casing} style={{ display: clickCount === 0 && !showInputs ? 'flex' : 'none' }}>
                                <div><FaRegIdCard /></div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={styles.casing} style={{ display: clickCount === 1 && !showInputs ? 'flex' : 'none' }}>
                                <div><FaRegIdCard /></div>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
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
        </>
    );
};

export default ForgotPassword;