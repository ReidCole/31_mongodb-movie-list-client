import styles from "./ListingButton.module.css";
import { ElementType, useRef } from "react";

type Props = {
  Icon: ElementType;
  mouseOverText: string;
  onClick: () => void;
};

const ListingButton: React.FC<Props> = ({ Icon, mouseOverText, onClick }) => {
  return (
    <button className={styles.button} title={mouseOverText} onClick={onClick}>
      <Icon />
    </button>
  );
};

export default ListingButton;
