import React from "react";
import Modal from "react-modal";
import style from '../styles/popupCorrect.module.css';

const PopupCorrect = ({ isOpen, onClosed, message }) => {
    return (
      <Modal 
            isOpen={isOpen} 
            onRequestClose={onClosed} 
            className={style.modalContent} 
            overlayClassName={style.modalOverlay} 
            ariaHideApp={false}
        >
            <h2 className={style.tittle}>Información</h2>
            <p className={style.contenido}>{message}</p>
            <button className={style.btnCerrar} onClick={onClosed}>Cerrar</button>
        </Modal>
    );
  };

export default PopupCorrect;