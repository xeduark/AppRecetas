import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/popupChange.module.css";

const PopupChangeP = ({ onClose }) => {
  return (
    <div className={`${styles.popup} ${styles.popupVisible}`}>
      <div className={styles.popupBackgroud} onClick={onClose}></div>
      <div className={styles.popupContent}>
        <FontAwesomeIcon icon={faQuestion} className={styles.popupIcon}/>
        <h3 className={styles.popupTitle}>¿Olvidaste tu contraseña?</h3>
        <form action="#" method="#">
          <div className={styles.inputBoxRecup}>
            <input
              className={styles.inpup}
              name="reset_email"
              type="email"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </div>
          <button
            className={styles.button}
            onClick={onClose}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
export default PopupChangeP;
