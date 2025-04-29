"use client";
import { useState } from "react";
import BlueBar from "@/components/ForLogin/BlueBar/page";
import FormBar from "@/components/ForLogin/FormBar//page";
import styles from "./Login.module.css";

const Login = () => {
  const [moveBlueBar, setMoveBlueBar] = useState(false);
  const [showAllFields, setShowAllFields] = useState(true);
  const [formHeight, setFormHeight] = useState("454.41px");
  const [info, setInfo] = useState({
    h1: "Olá",
    p: "Para seguir conectado à Unistore, faça login com seus dados.",
    btn: "Sing In"
  });
  const [form, setForm] = useState({
    h1: "Bem-vindo",
    btn: "Sign Up"
  });

  const handleButtonClick = () => {
    setMoveBlueBar((prevMove) => !prevMove);
    setTimeout(() => {
      setInfo((prevInfo) => ({
        h1: prevInfo.h1 === "Bem-vindo!" ? "Olá!" : "Bem-vindo!",
        p: prevInfo.p === "Para seguir conectado à Unistore, faça login com seus dados." ? "Crie sua conta na Unistore para acessar os nossos serviços." : "Para seguir conectado à Unistore, faça login com seus dados.",
        btn: prevInfo.btn === "Sing In" ? "Sign Up" : "Sing In"
      }));
      setForm((prevForm) => ({
        h1: prevForm.h1 === "Bem-vindo" ? "Bem-vindo " : "Bem-vindo",
        btn: prevForm.btn === "Sign Up" ? "Sign In" : "Sign Up"
      }));
    }, 350);
    setTimeout(() => {
      setShowAllFields((prevShow) => !prevShow);
      setFormHeight((prevShow) => (prevShow === "454.41px" ? "399.41px" : "454.41px"));
    }, 350);
  };

  return (
    <>
      <main className={styles.main}>
        <BlueBar
          h1={info.h1}
          p={info.p}
          btn={info.btn}
          onButtonClick={handleButtonClick}
          move={moveBlueBar}
        />
        <FormBar
          h1={form.h1}
          btn={form.btn}
          onButtonClick={handleButtonClick}
          move={moveBlueBar}
          showAllFields={showAllFields}
          formHeight={formHeight}
        />
      </main>
    </>
  );
};

export default Login;