import { MdAlternateEmail } from "react-icons/md";
import styles from "./Login.module.css";
import { IoFingerPrint, IoPersonOutline } from "react-icons/io5";
import { GiPadlock } from "react-icons/gi";
import DivisorLogin from "../../components/DivisorLogin/DivisorLogin";
import { FaLinkedinIn, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useState } from "react";

const Login = () => {
    const [divisorProps, setDivisorProps] = useState({
        h1: "Welcome Back!",
        p: "To keep connected with us please login with your personal info",
        btn: "Already have an account?",
    });

    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleButtonClick = () => {
        if (divisorProps.h1 === "Welcome Back!") {
            setDivisorProps({
                h1: "Hello, Friend!",
                p: "Enter you personal details and start journey with us",
                btn: "Sign Up",
            });
            setIsFormVisible(false);
        } else {
            setDivisorProps({
                h1: "Welcome Back!",
                p: "To keep connected with us please login with your personal info",
                btn: "Already have an account?",
            });
            setIsFormVisible(true);
        }
    };

    return (
        <>
            <div className={styles.main}>
                <DivisorLogin {...divisorProps} onClick={handleButtonClick} />

                <div    className={`${styles.containerformlogin} ${isFormVisible ? styles.hidden : ''}`} style={{ zIndex: isFormVisible ? 0 : 2 }}>

                    <div className={styles.contentformlogin}>

                            <h1>Welcome</h1>

                        <div className={styles.choicesform}>
                            <div className={styles.choicesitens}><FaGoogle /></div>
                            <div className={styles.choicesitens}><FaFacebookF /></div>
                            <div className={styles.choicesitens}><FaLinkedinIn /></div>
                        </div>

                        <form className={styles.formlogin}>
                            
                            <div className={styles.contentformitens}>
                                <div className={styles.inputcontainer}>
                                    <IoPersonOutline className={styles.inputicon} />
                                    <input type="Text" placeholder='RA' />
                                </div>
                                <div className={styles.inputcontainer}>
                                    <IoFingerPrint className={styles.inputicon} />
                                    <input type="Text" placeholder='Senha' />
                                </div>
                            </div>

                                <div className={styles.forgoutpass}><a>Forgot your password?</a></div>

                                <div className={styles.contentbtn}>
                                    <input type="submit" value="Sign In" className={styles.btnCreate} />
                                </div>
                            
                        </form>

                    </div>

                </div>

                <div className={`${styles.containerform} ${isFormVisible ? '' : styles.hidden}`} style={{ zIndex: isFormVisible ? 2 : 0 }}>
                    <div className={styles.contentform}>
                        <h1>Create Account</h1>
                        <div className={styles.choicesform}>
                            <div className={styles.choicesitens}><FaGoogle /></div>
                            <div className={styles.choicesitens}><FaFacebookF /></div>
                            <div className={styles.choicesitens}><FaLinkedinIn /></div>
                        </div>
                        <form className={styles.form}>
                            <div className={styles.contentformitens}>
                                <div className={styles.inputcontainer}>
                                    <IoPersonOutline className={styles.inputicon} />
                                    <input type="Text" placeholder='Nome' />
                                </div>
                                <div className={styles.inputcontainer}>
                                    <IoFingerPrint className={styles.inputicon} />
                                    <input type="Text" placeholder='RA' />
                                </div>
                                <div className={styles.inputcontainer}>
                                    <MdAlternateEmail className={styles.inputicon} />
                                    <input type="Text" placeholder='E-mail' />
                                </div>
                                <div className={styles.inputcontainer}>
                                    <GiPadlock className={styles.inputicon} />
                                    <input type='Password' placeholder='Senha' />
                                </div>
                            </div>
                            <div className={styles.contentbtn}>
                                <input type="submit" value="Sign Up" className={styles.btnCreate} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;