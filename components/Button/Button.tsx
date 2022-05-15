import { ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({ children, onClick, className, disabled }) => {
  return (
    <button
      disabled={disabled || false}
      className={`${styles.button} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
