import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import useSWR, { Fetcher } from "swr";
import List from "../components/List/List";
import SearchSection from "../components/SearchSection/SearchSection";
import { ListType } from "./list/[id]";
import NewList from "../components/NewList/NewList";
import TitleBar from "../components/TitleBar/TitleBar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Movie List Maker</title>
      </Head>

      <main>
        <TitleBar />

        <p>buttons: create new list | find list by name / id</p>
        <p>
          todo: make list/new page where you can make a new list. it should have a section to write
          the name and other details, the search section, and the list itself
        </p>
      </main>
    </>
  );
};

export default Home;
