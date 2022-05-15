import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ListType } from "../components/ListPage/ListPage";
import Header from "../components/Header/Header";
import { PlusOutlined } from "@ant-design/icons";
import ListLister from "../components/ListLister/ListLister";
import Image from "next/image";
import tmdbLogo from "../public/img/tmdb.svg";

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

        <ListLister lists={localStorageLists} heading="Local Storage Lists" linkPrefix="/local/" />
        <ListLister lists={accountLists} heading="Account Lists" linkPrefix="/list/" />

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
