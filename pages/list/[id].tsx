import axios from "axios";
import { nanoid } from "nanoid";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import List from "../../components/List/List";
import SearchSection from "../../components/SearchSection/SearchSection";
import TitleBar from "../../components/TitleBar/TitleBar";

export type ListType = {
  listName: string;
  listDescription: string;
  listings: ListingType[];
  ownerUserId: string;
  localStorageId?: string;
};

export type ListingType = {
  title: string;
  imgUrl: string | null;
  movieDbId: number | null;
  mediaType: "movie" | "tv";
  idWithinList: string | null; // id of this listing within a list
};

type ChangeableValues = {
  listName: string;
  listDescription: string;
  listings: ListingType[];
};

const ListPage: NextPage = () => {
  const [unchangedValues, setUnchangedValues] = useState<ChangeableValues | null>(null);
  const [listEdited, setListEdited] = useState<boolean>(false);
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [listings, setListings] = useState<ListingType[]>([]);
  const [ownerUserId, setOwnerUserId] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [objectId, setObjectId] = useState("");
  const [listExists, setListExists] = useState<boolean>(true);
  const router = useRouter();

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

  function revertChanges() {
    if (unchangedValues === null) return;

    setListName(unchangedValues.listName);
    setListDescription(unchangedValues.listDescription);
    setListings(unchangedValues.listings);
  }

  function onSaved() {
    setUnchangedValues({
      listName: listName,
      listDescription: listDescription,
      listings: listings,
    });
  }

  useEffect(() => {
    if (typeof router.query.id === "undefined") return;

    axios
      .get(`http://localhost:4000/getlist/${router.query.id}`)
      .then((res) => {
        const data = res.data;

        setListName(data.listName);
        setListDescription(data.listDescription);
        setListings(data.listings);
        setOwnerUserId(data.ownerUserId ? data.ownerUserId : "fix later");
        setObjectId(data._id);

        setUnchangedValues({
          listName: data.listName,
          listDescription: data.listDescription,
          listings: data.listings,
        });
      })
      .catch((e) => {
        if (e.response.status == 404) {
          console.error("No list with this id could be found in the database");
          setListExists(false);
        } else {
          console.error(e.message);
        }
      });
  }, [router.query.id]);

  useEffect(() => {
    if (unchangedValues === null) return;
    const currentValues: ChangeableValues = {
      listName: listName,
      listDescription: listDescription,
      listings: listings,
    };
    const isSame: boolean = JSON.stringify(unchangedValues) === JSON.stringify(currentValues);
    setListEdited(!isSame);
  }, [listName, listDescription, listings, unchangedValues]);

  if (!listExists)
    return (
      <div>
        Error: There is no list with the given id in the database. This list may have been deleted
        or there was a typo.
      </div>
    );

  if (listings.length === 0) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>List - Movie List Maker</title>
      </Head>
      <main>
        <TitleBar />

        <SearchSection onAddToList={addToList} />

        <List
          listName={listName}
          setListName={setListName}
          listDescription={listDescription}
          setListDescription={setListDescription}
          listings={listings}
          setListings={setListings}
          objectId={objectId}
          ownerUsername={ownerUsername}
          onRemoveFromList={removeFromList}
          listEdited={listEdited}
          onRevertChanges={revertChanges}
          onSaved={onSaved}
        />
      </main>
    </>
  );
};

export default ListPage;
