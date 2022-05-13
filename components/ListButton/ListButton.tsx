import styles from "./ListButton.module.css";

type Props = {
  text: string;
  Icon: React.ElementType;
  onClick: () => void;
  disabled?: boolean;
};

const ListButton: React.FC<Props> = ({ text, Icon, onClick, disabled }) => {
  return (
    <button disabled={disabled} className={styles.button} onClick={onClick}>
      <Icon className={styles.icon} /> <p>{text}</p>
    </button>
  );
};

export default ListButton;
