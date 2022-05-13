import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import List from "../../components/List/List";
import SearchSection from "../../components/SearchSection/SearchSection";

export type ListType = {
  listName: string;
  listDescription: string;
  listings: ListingType[];
  ownerUserId: string;
};

export type ListingType = {
  title: string;
  imgUrl: string | null;
  movieDbId: number | null;
  mediaType: "movie" | "tv";
  idWithinList: string | null; // id of this listing within a list
};

const ListPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>List - Movie List Maker</title>
      </Head>
      <main>
        {/* <SearchSection onAddToList={} /> */}

        <List listObjectId={router.query.id ? router.query.id.toString() : null} />
      </main>
    </>
  );
};

export default ListPage;
