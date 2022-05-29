import type { NextPage } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ListType } from "../components/ListPage/ListPage";
import Header from "../components/Header/Header";
import { PlusOutlined } from "@ant-design/icons";
import ListLister, { ListLink } from "../components/ListLister/ListLister";
import Image from "next/image";
import tmdbLogo from "../public/img/tmdb.svg";
import Notification from "../components/Notification/Notification";
import useNotificationState from "../hooks/useNotificationState";
import { AuthContext } from "../context/AuthContext";
import Container from "../components/Container/Container";
import axios from "axios";
import Footer from "../components/Footer/Footer";

const Home: NextPage = () => {
  const [localStorageLists, setLocalStorageLists] = useState<ListType[]>([]);
  const [accountLists, setAccountLists] = useState<ListLink[]>([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    function getAccountLists() {
      if (auth === null || auth.username === null) return;
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/getaccountlists`, { username: auth.username })
        .then((res) => {
          setAccountLists(res.data);
        })
        .catch((e) => console.error(e));
    }

    getAccountLists();

    const lsLists = localStorage.getItem("lists");
    if (lsLists == null) {
      return;
    }
    setLocalStorageLists(JSON.parse(lsLists));
  }, [auth]);

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
            <a className={styles.tmdbImg} rel="noreferrer noopener" target="_blank">
              <Image src={tmdbLogo} width={185} height={133} alt="the movie DB logo" />
            </a>
          </Link>
          <p>
            This site uses the API provided by{" "}
            <Link href="https://www.themoviedb.org/" passHref>
              <a className={styles.link} rel="noreferrer noopener" target="_blank">
                The Movie DB
              </a>
            </Link>{" "}
            for movie and TV show search results.
          </p>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Home;
