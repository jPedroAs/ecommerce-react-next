// components/Banner/index.jsx
"use client";

import styles from "./Banner.module.css"; // Opcional

const Banner = () => {
  return (
    <div className={styles.banner}>
      <img 
        src="https://i.postimg.cc/Pf3WCPQh/Banner-Catalog.png" // Caminho da imagem na pasta public
        alt="Banner promocional" 
        className={styles.bannerImage} 
      />

    </div>
  );
};

export default Banner;
