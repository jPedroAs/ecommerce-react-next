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
    h1: "Welcome Back!",
    p: "To keep connected with us please login with your personal info",
    btn: "Already have an account?"
  });
  const [form, setForm] = useState({
    h1: "Welcome",
    btn: "Sign Up"
  });

  const handleButtonClick = () => {
    setMoveBlueBar((prevMove) => !prevMove);
    setTimeout(() => {
      setInfo((prevInfo) => ({
        h1: prevInfo.h1 === "Welcome Back!" ? "Hello, Friend!" : "Welcome Back!",
        p: prevInfo.p === "To keep connected with us please login with your personal info" ? "Enter your personal details and start your journey with us" : "To keep connected with us please login with your personal info",
        btn: prevInfo.btn === "Already have an account?" ? "Sign Up" : "Already have an account?"
      }));
      setForm((prevForm) => ({
        h1: prevForm.h1 === "Welcome" ? "Create Account" : "Welcome",
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