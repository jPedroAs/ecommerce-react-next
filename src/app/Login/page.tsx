"use client"
import './index.css'
import { IoFingerPrint, IoPersonOutline } from "react-icons/io5";
import { GiPadlock } from "react-icons/gi";
import { MdAlternateEmail } from "react-icons/md";
import api from "../../services/api"
import { useState, useRef } from "react";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";


function Login() {
  const router = useRouter();

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
      const response = await api.post("/Login", body)
      console.log(response.status)
      if (response.status == 200) {
        const data = response.data
        console.log(data)
        localStorage.setItem("token", data.token);
        // router.push("/Home");
        window.location.href = "/Home";
      }
      else if (response.status == 204) {
        Swal.fire({
          text: "Usário não registrado",
          icon: "error",
        });
      }
      else if (response.status == 400) {
        Swal.fire({
          text: "Senha Inválida",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        text: "Ocorreu um erro ao Fazer o Login.",
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


  const [isSignUp, setIsSignUp] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);


  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  // const handleSignUp = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setIsModalOpen(true);
  // };

  return (
    <>
      <div className={`container ${isSignUp ? "right-painel-active" : ""}`}>
        <div className='signin'>
          <h1 >Bem Vindo</h1>
          <form onSubmit={ReqLogin}>
            <div className='input-container'>
              <IoFingerPrint className="input-icon" />
              <input type="Text" placeholder='RA/Email' ref={inputLoginRa} />
            </div>
            <div className='input-container'>
              <GiPadlock className="input-icon" />
              <input type='Password' placeholder='Senha' ref={inputLoginSenha} />
            </div>
            <a href="" onClick={ResetSenha}>Esqueci minha senha</a>
            <button className='bnt-form' onClick={ReqLogin}>Sign In</button>
          </form>
        </div>


        <div className='signup'>
          <h1 className='cad'>Sign Up</h1>
          <form onSubmit={createUser}>
            <div className='input-container'>
              <IoPersonOutline className="input-icon" />
              <input type="Text" placeholder='Nome' ref={inputName} />
            </div>
            <div className='input-container'>
              <IoFingerPrint className="input-icon" />
              <input type="Text" placeholder='RA' ref={inputRa} />
            </div>
            <div className='input-container'>
              <MdAlternateEmail className="input-icon" />
              <input type="Text" placeholder='E-mail' ref={inputEmail} />
            </div>
            <div className='input-container'>
              <GiPadlock className="input-icon" />
              <input type='Password' placeholder='Senha' ref={inputSenha} />
            </div>
            <button className='bnt-form' onClick={createUser}>Sign Up</button>
          </form>
        </div>


        <div className='overlay-conatainer'>
          <div className='overlay'>
            <div className='overlay-right' >
              <h1 className='h1-right'>Uni Store</h1>
              <p className='p-right'>Crie Sua conta clicando no botão Sign Up</p>
              <button className='bnt-singup' onClick={toggleForm}>Sign Up</button>
            </div>
            <div className='overlay-left' >
              <h1 className='h1-right'>Uni Store</h1>
              <p className='p-right'>Acesse sua conta realizando Sign In</p>
              <button className='bnt-singin' onClick={toggleForm}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login