"use client";
import { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("hasVisited");
    }
    return true;
  });

  useEffect(() => {
    if (isVisible) {
      localStorage.setItem("hasVisited", "true");

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.loaderContainer} ${styles.fadeOut}`}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Loader;
