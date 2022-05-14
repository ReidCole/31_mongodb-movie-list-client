import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListType } from "../components/ListPage/ListPage";

const Home: NextPage = () => {
  const [localStorageLists, setLocalStorageLists] = useState<ListType[]>([]);

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

        <div>
          <h2>Local Storage Lists</h2>
          {localStorageLists.map((list) => (
            <div key={list.localStorageId}>
              <Link href={`/local/${list.localStorageId}`}>{list.listName}</Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
