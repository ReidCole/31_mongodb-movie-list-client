import React from "react";
import styles from "./Modal.module.css";

type Props = {
  children: React.ReactNode;
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
};

const Modal: React.FC<Props> = ({ children, isVisible, setIsVisible }) => {
  return (
    <div
      id="modal-bg"
      className={`${styles.container} ${isVisible ? styles.visible : ""}`}
      onClick={(e) => {
        const id = (e.target as HTMLDivElement).id;
        if (id === "modal-bg") {
          setIsVisible(false);
        }
      }}
    >
      <div className={styles.modal}>{children}</div>
    </div>
  );
};

export default Modal;
