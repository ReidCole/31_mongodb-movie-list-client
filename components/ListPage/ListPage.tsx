import axios from "axios";
import { nanoid } from "nanoid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import List from "../List/List";
import SearchSection from "../SearchSection/SearchSection";
import styles from "./ListPage.module.css";

type Props = {
  listLocation: "localStorage" | "server";
};

export type ListType = {
  listName: string;
  listDescription: string;
  listings: ListingType[];
  ownerUsername: string;
  listId: string;
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
          setOwnerUsername(data.ownerUsername);
          setListId(data._id);

          setUnchangedValues({
            listName: data.listName,
            listDescription: data.listDescription,
            listings: data.listings,
          });
        })
        .catch((e) => {
          let errorText = "";
          switch (e.response.status) {
            case 404:
              errorText =
                "No list with this ID could be found in the server database. It may have been deleted.";
              break;
            case 500:
              errorText =
                "Invalid list ID format. The list ID in the URL should be 24 hexadecimal characters.";
              break;
            case 0:
              errorText =
                "Couldn't connect to the server. It may be offline right now. Please try again later.";
              break;
            default:
              errorText = "Something went wrong. Please try again later.";
              break;
          }
          console.error(e.message);
          setErrorGettingList(errorText);
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
          listId: string;
        }) => {
          const l: ListType = {
            listName: list.listName,
            listDescription: list.listDescription,
            listings: list.listings,
            listId: list.listId,
            ownerUsername: "localstorage",
          };
          return l;
        }
      );

      const thisList = typedLists.find((l) => l.listId === router.query.id);
      if (typeof thisList === "undefined") {
        setErrorGettingList("No list with the given id exists in local storage.");
        return;
      }
      if (typeof thisList.listId === "undefined") {
        console.error("listId is undefined");
        return;
      }
      setListName(thisList.listName);
      setListDescription(thisList.listDescription);
      setListings(thisList.listings);
      setOwnerUsername("you (local storage)");
      setListId(thisList.listId);
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

  if (errorGettingList.length > 0)
    return (
      <>
        <Head>
          <title>Error - Movie List Maker</title>
        </Head>
        <main>
          <Header />
          <p className={styles.errorMsg}>Error: {errorGettingList}</p>
        </main>
      </>
    );

  if (listings.length === 0) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>List - Movie List Maker</title>
      </Head>
      <main>
        <Header />

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
