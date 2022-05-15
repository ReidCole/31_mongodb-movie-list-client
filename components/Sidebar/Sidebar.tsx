import { ArrowRightOutlined, HomeOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./Sidebar.module.css";

type Props = {
  isOpen: boolean;
  setIsOpen(value: boolean): void;
};

const Sidebar: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  if (isOpen)
    return (
      <div>
        <div className={styles.background} onClick={() => setIsOpen(false)} />
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
          <div className={styles.header}>
            <button
              className={`${styles.backButton} ${isOpen ? styles.open : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <ArrowRightOutlined />
            </button>
          </div>

          <nav className={styles.nav}>
            <Link href="/" passHref>
              <a className={styles.link}>
                <HomeOutlined /> Home
              </a>
            </Link>
            <Link href="/newlist" passHref>
              <a className={styles.link}>
                <PlusOutlined /> New List
              </a>
            </Link>
            <Link href="/login" passHref>
              <a className={styles.link}>
                <UserOutlined /> Log In
              </a>
            </Link>
          </nav>
        </div>
      </div>
    );
  else return <></>;
};

export default Sidebar;
