import styles from "./ListingButton.module.css";
import { ElementType, useRef } from "react";

type Props = {
  Icon: ElementType;
  mouseOverText: string;
  onClick: () => void;
  disabled?: boolean;
};

const ListingButton: React.FC<Props> = ({ Icon, mouseOverText, onClick, disabled }) => {
  return (
    <button
      className={styles.button}
      title={mouseOverText}
      onClick={onClick}
      disabled={disabled || false}
    >
      <Icon />
    </button>
  );
};

export default ListingButton;
