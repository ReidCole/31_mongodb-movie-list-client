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
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Movie List Maker</title>
      </Head>

      <main>
        <TitleBar />

        <Link href="/newlist">Create New List</Link>
        <label>
          <p>Search For List by Name</p>
          <input type="text" />
        </label>
        <label>
          <p>Search For List by ID</p>
          <input type="text" />
        </label>

        <p>Show lists from local storage and account</p>
      </main>
    </>
  );
};

export default Home;
