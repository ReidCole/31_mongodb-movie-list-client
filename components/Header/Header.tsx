import { HomeOutlined, MenuOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
          <Link href="/" passHref>
            <a className={styles.link}>
              <PlusOutlined /> New List
            </a>
          </Link>
          <Link href="/" passHref>
            <a className={styles.link}>
              <UserOutlined /> Sign In
            </a>
          </Link>
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
