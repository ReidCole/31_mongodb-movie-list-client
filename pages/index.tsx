import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ListType } from "../components/ListPage/ListPage";
import Header from "../components/Header/Header";
import { PlusOutlined } from "@ant-design/icons";

const Home: NextPage = () => {
  const [localStorageLists, setLocalStorageLists] = useState<ListType[]>([]);
  const [accountLists, setAccountLists] = useState<ListType[]>([]);

  useEffect(() => {
    const lsLists = localStorage.getItem("lists");
    if (lsLists == null) {
      return;
    }
    setLocalStorageLists(JSON.parse(lsLists));
  }, []);

  return (
    <>
      <Head>
        <title>Movie List Maker</title>
      </Head>

      <main>
        <Header />

        <Link href="/newlist">
          <a className={styles.createNewList}>
            <PlusOutlined /> Create New List
          </a>
        </Link>

        <div className={styles.listTypeContainer}>
          <h2 className={styles.listTypeHeading}>Local Storage Lists</h2>
          {localStorageLists.map((list) => (
            <div key={list.listId}>
              <Link href={`/local/${list.listId}`}>{list.listName}</Link>
            </div>
          ))}
        </div>

        <div className={styles.listTypeContainer}>
          <h2 className={styles.listTypeHeading}>Account Lists</h2>
          {localStorageLists.map((list) => (
            <div key={list.listId}>
              <Link href={`/list/${list.listId}`}>{list.listName}</Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
