import Link from "next/link";
import styles from "./TitleBar.module.css";

const TitleBar: React.FC = () => {
  return (
    <Link href="/">
      <h1 className={styles.title}>Movie List Maker</h1>
    </Link>
  );
};

export default TitleBar;
