import { ReactNode } from "react";
import styles from "./Container.module.css";

type Props = {
  header: ReactNode;
  body: ReactNode;
};

const Container: React.FC<Props> = ({ header, body }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{header}</div>
      {body}
    </div>
  );
};

export default Container;
