import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import List from "../../components/List/List";

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
  const [list, setList] = useState<ListType | null>(null);
  const [objectId, setObjectId] = useState("");

  useEffect(() => {
    if (typeof router.query.id === "undefined") return;

    console.log("get list with object id", router.query.id);
    axios.get(`http://localhost:4000/getlist/${router.query.id}`).then((res) => {
      const data = res.data;
      const listToSet: ListType = {
        listName: data.listName,
        listDescription: data.listDescription,
        listings: data.listings,
        ownerUserId: data.ownerUserId ? data.ownerUserId : "fix later",
      };
      setList(listToSet);
      setObjectId(data._id);
    });
  }, [router.query.id]);

  if (list === null) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>List: {list.listName} - Movie List Maker</title>
      </Head>
      <main>
        <List list={list} />
      </main>
    </>
  );
};

export default ListPage;
