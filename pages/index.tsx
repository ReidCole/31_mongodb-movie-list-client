import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import useSWR, { Fetcher } from "swr";
import SearchResult from "../components/SearchResult/SearchResult";
import List from "../components/List/List";
import SearchSection from "../components/SearchSection/SearchSection";

// todo: use swr for initial load of list, not for search results

export type ListingType = {
  title: string;
  imgUrl: string | null;
  id: number | null;
  mediaType: "movie" | "tv";
};

const testList: ListingType[] = [
  {
    title: "Liz and the Blue Bird",
    id: 482150,
    imgUrl: "https://image.tmdb.org/t/p/w500/7xRIkqWJy4cNpUxPo5aZ24O0Tyx.jpg",
    mediaType: "movie",
  },
  {
    title: "Sound! Euphonium",
    id: 62564,
    imgUrl: "https://image.tmdb.org/t/p/w500/l0hKrx6PjQRrHiMzK2Fanen2xbL.jpg",
    mediaType: "tv",
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Movie List Maker</title>
      </Head>

      <main>
        <h1 className={styles.title}>Movie List Maker</h1>

        <SearchSection />

        <List list={testList} title="Test List" />
      </main>
    </>
  );
};

export default Home;
