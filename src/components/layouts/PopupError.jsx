import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/popup.module.css";

const PopupError = ({ onClose }) => {
  return (
    <div className={`${styles.popup} ${styles.popupVisible}`}>
      <div className={styles.popupBackground} onClick={onClose}></div>
      <div className={styles.popupContent}>
        <FontAwesomeIcon icon={faTimes} className={styles.popupIcon} />{" "}
        <h3 className={styles.popupTitle}>Correo o contraseña incorrectos</h3>
        <p id="popup-message">
          Por favor, verifica tu correo electrónico o contraseña.
        </p>
        <p id="popup-message">Inténtalo de nuevo.</p>
        <p>
          <button
            className={`${styles.button} ${styles.buttonError}`}
            onClick={onClose}
          >
            OK
          </button>
        </p>
      </div>
    </div>
  );
};

export default PopupError;
