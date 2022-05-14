import axios from "axios";
import { nanoid } from "nanoid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import List from "../List/List";
import SearchSection from "../SearchSection/SearchSection";
import TitleBar from "../TitleBar/TitleBar";

type Props = {
  listLocation: "localStorage" | "server";
};

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

const ListPage: React.FC<Props> = ({ listLocation }) => {
  const [unchangedValues, setUnchangedValues] = useState<ChangeableValues | null>(null);
  const [listEdited, setListEdited] = useState<boolean>(false);
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [listings, setListings] = useState<ListingType[]>([]);
  const [ownerUserId, setOwnerUserId] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [listId, setListId] = useState("");
  const [errorGettingList, setErrorGettingList] = useState<string>("");
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

    if (listLocation === "server") {
      axios
        .get(`http://localhost:4000/getlist/${router.query.id}`)
        .then((res) => {
          const data = res.data;

          setListName(data.listName);
          setListDescription(data.listDescription);
          setListings(data.listings);
          setOwnerUserId(data.ownerUserId ? data.ownerUserId : "fix later");
          setListId(data._id);

          setUnchangedValues({
            listName: data.listName,
            listDescription: data.listDescription,
            listings: data.listings,
          });
        })
        .catch((e) => {
          if (e.response.status == 404) {
            console.error("No list with this id could be found in the database");
            setErrorGettingList("No list with this id could be found in the server database");
          } else {
            console.error(e.message);
          }
        });
    } else {
      const lsListsString = localStorage.getItem("lists");
      if (lsListsString === null) {
        setErrorGettingList(
          "There are no lists saved to local storage. They may have been cleared out of the browser or someone gave you a link to an offline list."
        );
        return;
      }
      const lsLists = JSON.parse(lsListsString);
      const typedLists: ListType[] = lsLists.map(
        (list: {
          listName: string;
          listDescription: string;
          listings: ListingType[];
          localStorageId: string;
        }) => {
          const l: ListType = {
            listName: list.listName,
            listDescription: list.listDescription,
            listings: list.listings,
            localStorageId: list.localStorageId,
            ownerUserId: "localstorage",
          };
          return l;
        }
      );

      const thisList = typedLists.find((l) => l.localStorageId === router.query.id);
      if (typeof thisList === "undefined") {
        setErrorGettingList("No list with the given id exists in local storage.");
        return;
      }
      if (typeof thisList.localStorageId === "undefined") {
        console.error("list localStorageId is undefined");
        return;
      }
      setListName(thisList.listName);
      setListDescription(thisList.listDescription);
      setListings(thisList.listings);
      setOwnerUserId("You (local storage)");
      setListId(thisList.localStorageId);
      setUnchangedValues({
        listName: thisList.listName,
        listDescription: thisList.listDescription,
        listings: thisList.listings,
      });
    }
  }, [router.query.id, listLocation]);

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

  if (errorGettingList.length > 0) return <div>{errorGettingList}</div>;

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
          listId={listId}
          ownerUsername={ownerUsername}
          onRemoveFromList={removeFromList}
          listEdited={listEdited}
          onRevertChanges={revertChanges}
          onSaved={onSaved}
          listLocation={listLocation}
        />
      </main>
    </>
  );
};

export default ListPage;
