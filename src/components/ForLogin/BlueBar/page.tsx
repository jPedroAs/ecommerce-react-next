"use client";
import styles from "./BlueBar.module.css";
import { BlueBlock } from "@/Types/Interface";

const BlueBar = (props: BlueBlock) => {
  return (
    <>
      <div className={`${styles.container} ${props.move ? styles.move : ""}`}>
        <div className={styles.content}>
          <div>
            <h1>{props.h1}</h1>
            <p>{props.p}</p>
          </div>
          <button onClick={props.onButtonClick}>{props.btn}</button>
        </div>
      </div>
    </>
  );
};

export default BlueBar;