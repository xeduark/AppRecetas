import React, { useState, useEffect } from "react";
import styles from "../styles/loader.module.css"; 

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={isLoading ? styles.loaderWrapper : ""}>
      {isLoading && (
        <>
          <div className={styles.loader} />
          <div className={styles.loaderSection + " " + styles.sectionLeft} />
          <div className={styles.loaderSection + " " + styles.sectionRight} />
        </>
      )}
    </div>
  );
};

export default Loader;