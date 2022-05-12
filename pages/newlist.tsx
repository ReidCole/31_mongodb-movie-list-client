import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import NewList from "../components/NewList/NewList";
import SearchSection from "../components/SearchSection/SearchSection";
import TitleBar from "../components/TitleBar/TitleBar";
import { nanoid } from "nanoid";
import { ListingType } from "./list/[id]";

const NewListPage: NextPage = () => {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [listings, setListings] = useState<ListingType[]>([]);

  function addToList(listing: ListingType) {
    const newListing: ListingType = {
      ...listing,
      idWithinList: nanoid(),
    };
    setListings((prev) => [...prev, newListing]);
  }

  function removeFromList(listing: ListingType) {
    setListings((prev) => prev.filter((l) => l.idWithinList !== listing.idWithinList));
  }

  return (
    <>
      <Head>
        <title>New List - Movie List Maker</title>
      </Head>
      <main>
        <TitleBar />
        <SearchSection onAddToList={addToList} />
        <NewList
          listName={listName}
          setListName={setListName}
          listDescription={listDescription}
          setListDescription={setListDescription}
          listings={listings}
          setListings={setListings}
          onRemoveFromList={removeFromList}
        />
      </main>
    </>
  );
};

export default NewListPage;
