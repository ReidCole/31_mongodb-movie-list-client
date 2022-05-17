import {
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  return (
    <>
      <header className={styles.header}>
        <Link href="/">
          <h1 className={styles.title}>Movie List Maker</h1>
        </Link>
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
          {auth && auth.username ? (
            <button className={styles.link} onClick={auth.logout}>
              <LogoutOutlined /> Log Out
            </button>
          ) : (
            <Link href={`/login?prevRoute=${router.asPath}`} passHref>
              <a className={styles.link}>
                <UserOutlined /> Log In
              </a>
            </Link>
          )}
        </nav>
        <button className={styles.sidebarButton} onClick={() => setIsSidebarOpen(true)}>
          <MenuOutlined />
        </button>
      </header>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </>
  );
};

export default Header;
