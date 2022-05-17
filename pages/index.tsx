import type { NextPage } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ListType } from "../components/ListPage/ListPage";
import Header from "../components/Header/Header";
import { PlusOutlined } from "@ant-design/icons";
import ListLister from "../components/ListLister/ListLister";
import Image from "next/image";
import tmdbLogo from "../public/img/tmdb.svg";
import Notification from "../components/Notification/Notification";
import useNotificationState from "../hooks/useNotificationState";
import { AuthContext } from "../context/AuthContext";
import Container from "../components/Container/Container";

const Home: NextPage = () => {
  const [localStorageLists, setLocalStorageLists] = useState<ListType[]>([]);
  const [accountLists, setAccountLists] = useState<ListType[]>([]);
  const auth = useContext(AuthContext);

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

        <ListLister lists={localStorageLists} heading="Local Storage Lists" linkPrefix="/local/" />
        {auth && auth.username ? (
          <ListLister lists={accountLists} heading="Account Lists" linkPrefix="/list/" />
        ) : (
          <Container
            header={<h2 className={styles.containerHeading}>Account Lists</h2>}
            body={
              <p className={styles.loginText}>
                Please log in to an account to save lists to the server
              </p>
            }
          />
        )}

        <div className={styles.tmdb}>
          <Link href="https://www.themoviedb.org/" passHref>
            <a className={styles.tmdbImg}>
              <Image src={tmdbLogo} width={185} height={133} alt="the movie DB logo" />
            </a>
          </Link>
          <p>
            This site uses the API provided by{" "}
            <Link href="https://www.themoviedb.org/" passHref>
              <a className={styles.link}>The Movie DB</a>
            </Link>{" "}
            for movie and TV show search results.
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
