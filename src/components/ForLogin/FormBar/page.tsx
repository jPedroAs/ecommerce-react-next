"use client";
import { FaFacebook, FaGoogle, FaLinkedin, FaRegIdCard } from "react-icons/fa";
import styles from "./FormBar.module.css";
import { FormBlock } from "@/Types/Interface";
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { useRef } from "react";
import Swal from "sweetalert2";

const FormBar = (props: FormBlock) => {

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const inputName = useRef<HTMLInputElement>(null);
  const inputRa = useRef<HTMLInputElement>(null);
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputSenha = useRef<HTMLInputElement>(null);


  const inputLoginRa = useRef<HTMLInputElement>(null);
  const inputLoginSenha = useRef<HTMLInputElement>(null);

  async function ReqLogin(event: React.FormEvent) {
    event.preventDefault();
    const body = {
      ra: inputLoginRa.current?.value,
      senha: inputLoginSenha.current?.value
    }
    try {
      const response = await api.post("/Login", body);
      if (response.status === 200) {
        const data = response.data;
        logout();
        login(data.token);
        window.location.href = "/Catalog";
      } else {
        Swal.fire({
          text: "Credenciais inválidas",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        text: "Erro ao fazer login.",
        icon: "error",
      });
    }
  }

  async function createUser(event: React.FormEvent) {
    event.preventDefault();
    try {
      const body = {
        name: inputName.current?.value,
        email: inputEmail.current?.value,
        senha: inputSenha.current?.value,
        ra: inputRa.current?.value
      };
      console.log(body)

      const response = await api.post("/Cadastro", body);
      console.log(response.status)
      console.log(response.data.status)

      if (response.status == 200) {
        Swal.fire({
          text: "Seu cadastro foi concluído com sucesso.",
          icon: "success",
        });
      }
      else if (response.status == 400) {
        Swal.fire({
          text: "Usuário já registrado",
          icon: "error",
        });

        if (inputName.current) inputName.current.value = "";
        if (inputRa.current) inputRa.current.value = "";
        if (inputEmail.current) inputEmail.current.value = "";
        if (inputSenha.current) inputSenha.current.value = "";
      }
      else {
        Swal.fire({
          text: "Usuário já registrado.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        text: "Ocorreu um erro ao cadastrar o usuário.",
        icon: "error",
      });
    }
  }

  function ResetSenha(event: React.FormEvent) {
    event.preventDefault();
    Swal.fire({
      title: "Informe o E-mail registrado",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then(() => {
      Swal.fire({
        title: `E-mail Enviado`
      });
    })
  }

  return (
    <>
      <div className={`${styles.container} ${props.move ? styles.move : ""}`}>
        <div className={styles.content}>
          <h1>{props.h1}</h1>
          <div className={styles.options}>
            {/* <div><FaGoogle /></div>
            <div><FaFacebook /></div>
            <div><FaLinkedin /></div> */}
          </div>
          {props.showAllFields ? (
            <form onSubmit={createUser} className={styles.form} style={{ height: props.formHeight }}>
              <div>
                <div><CiUser /></div>
                <input type="text" placeholder="Nome" ref={inputName}/>
              </div>
              <div>
                <div><FaRegIdCard /></div>
                <input type="number" placeholder="RA" ref={inputRa}/>
              </div>
              <div>
                <div><MdOutlineEmail /></div>
                <input type="e-mail" placeholder="E-mail" ref={inputEmail}/>
              </div>
              <div>
                <div><TbLockPassword /></div>
                <input type="password" placeholder="Password" ref={inputSenha}/>
              </div>
              <button onClick={createUser}>{props.btn}</button>
            </form>
          ) : (
            <form onSubmit={ReqLogin} className={styles.form} style={{ height: props.formHeight }}>
              <div>
                <div><FaRegIdCard /></div>
                <input type="number" placeholder="RA" ref={inputLoginRa}/>
              </div>
              <div>
                <div><TbLockPassword /></div>
                <input type="password" placeholder="Password" ref={inputLoginSenha}/>
              </div>
              <a href="#" onClick={ResetSenha}>Forgot your password?</a>
              <button onClick={ReqLogin}>{props.btn}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default FormBar;

