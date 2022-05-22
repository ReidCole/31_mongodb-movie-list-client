import {
  MinusCircleFilled,
  UserOutlined,
  DownloadOutlined,
  UndoOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { DragEvent, useContext, useEffect, useState } from "react";
import { ListingType, ListType } from "../../components/ListPage/ListPage";
import { AuthContext } from "../../context/AuthContext";
import useNotificationState from "../../hooks/useNotificationState";
import Button from "../Button/Button";
import Container from "../Container/Container";
import Listing from "../Listing/Listing";
import ListingButton from "../ListingButton/ListingButton";
import Loading from "../Loading/Loading";
import Notification from "../Notification/Notification";
import styles from "./NewList.module.css";

type Props = {
  listName: string;
  setListName(val: string): void;
  listDescription: string;
  setListDescription(val: string): void;
  listings: ListingType[];
  setListings(listings: ListingType[]): void;
  onRemoveFromList(listing: ListingType): void;
};

const NewList: React.FC<Props> = ({
  listName,
  setListName,
  listDescription,
  setListDescription,
  listings,
  setListings,
  onRemoveFromList,
}) => {
  const router = useRouter();
  const [canSave, setCanSave] = useState<boolean>(false);
  const [notificationState, showNotification] = useNotificationState();
  const [isLoading, setIsLoading] = useState(false);
  const [listingBeingReordered, setListingBeingReordered] = useState<ListingType | null>(null);
  const auth = useContext(AuthContext);

  function saveToAccount() {
    if (auth === null || auth.username == null) return;
    if (!canSave) {
      console.error("error validating list. make sure all required fields are filled in");
      return;
    }

    setIsLoading(true);

    const newList: ListType = {
      listName: listName,
      listDescription: listDescription,
      ownerUsername: auth.username,
      listings: listings,
      listId: "",
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/createlist`, newList)
      .then((res) => router.push(`/list/${res.data}`))
      .catch((e) => {
        showNotification("Error: Something went wrong. Please try again later.", "red");
        setIsLoading(false);
        console.error(e.message);
      });
  }

  function saveToLocalStorage() {
    if (!canSave) {
      console.error("error validating list. make sure all required fields are filled in");
      return;
    }

    setIsLoading(true);

    const newList: ListType = {
      listName: listName,
      listDescription: listDescription,
      ownerUsername: "localstorage",
      listings: listings,
      listId: nanoid(),
    };
    const currentListsString = localStorage.getItem("lists");
    if (currentListsString === null) {
      const lists: ListType[] = [newList];
      const listsString = JSON.stringify(lists);
      localStorage.setItem("lists", listsString);
    } else {
      let currentLists = JSON.parse(currentListsString);
      currentLists.push(newList);
      const newListsString = JSON.stringify(currentLists);
      localStorage.setItem("lists", newListsString);
    }
    router.push(`/local/${newList.listId}`);
  }

  function swapListings(a: number, b: number) {
    if (a < 0 || b < 0 || a === listings.length || b === listings.length) return;
    let newListings = listings.slice();
    const temp = newListings[a];
    newListings[a] = newListings[b];
    newListings[b] = temp;
    setListings(newListings);
  }

  function onDropListing(e: DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    const draggedItemString = e.dataTransfer.getData("listing");
    if (draggedItemString === "") return;
    const draggedItem: ListingType = JSON.parse(draggedItemString);
    const prevIndex = listings.findIndex((i) => i.idWithinList === draggedItem.idWithinList);
    let listWithoutPrev = listings.slice();
    listWithoutPrev.splice(prevIndex, 1);
    const newIndex = index;
    const firstHalf = listWithoutPrev.slice(0, newIndex);
    const secondHalf = listWithoutPrev.slice(newIndex, listWithoutPrev.length);
    const finalList = [...firstHalf, draggedItem, ...secondHalf];
    setListings(finalList);
  }

  useEffect(() => {
    if (listName.length > 0 && listings.length > 0) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [listName, listings]);

  return (
    <>
      <Container
        header={
          <>
            <h2 className={styles.heading}>New List</h2>
            <div className={styles.detailsSection}>
              <input
                className={styles.editTitle}
                type="text"
                value={listName}
                placeholder="Name..."
                onChange={(e) => setListName(e.target.value)}
              />
              <textarea
                className={styles.editDescription}
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                rows={4}
                placeholder="Description..."
              />
            </div>
            <div className={styles.buttonSection}>
              {auth && auth.username ? (
                <Button onClick={saveToAccount} disabled={!canSave}>
                  <UserOutlined /> Save to Account
                </Button>
              ) : (
                <Button onClick={() => {}} disabled={true}>
                  Log in to save to server
                </Button>
              )}

              <Button onClick={saveToLocalStorage} disabled={!canSave}>
                <DownloadOutlined /> Save to Local Storage
              </Button>
              <Button onClick={() => setListings([])} disabled={!canSave}>
                <UndoOutlined /> Reset
              </Button>
            </div>
          </>
        }
        body={
          listings.length > 0 ? (
            <div className={styles.list}>
              {listings.map((listing, index) => (
                <Listing
                  key={listing.idWithinList}
                  listing={listing}
                  buttons={[
                    <ListingButton
                      key={0}
                      Icon={ArrowUpOutlined}
                      mouseOverText="Remove From List"
                      onClick={() => swapListings(index, index - 1)}
                      disabled={index === 0}
                    />,
                    <ListingButton
                      key={1}
                      Icon={MinusCircleFilled}
                      mouseOverText="Remove From List"
                      onClick={() => onRemoveFromList(listing)}
                    />,
                    <ListingButton
                      key={2}
                      Icon={ArrowDownOutlined}
                      mouseOverText="Remove From List"
                      onClick={() => swapListings(index, index + 1)}
                      disabled={index === listings.length - 1}
                    />,
                  ]}
                  canReorder={true}
                  onDragStart={(e) => {
                    const draggedItemString = JSON.stringify(listing);
                    e.dataTransfer.setData("listing", draggedItemString);
                    setListingBeingReordered(listing);
                  }}
                  onDragOver={(e) => {
                    if (
                      listingBeingReordered &&
                      listingBeingReordered.idWithinList !== listing.idWithinList
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onDrop={(e) => onDropListing(e, index)}
                />
              ))}
            </div>
          ) : (
            <p className={styles.emptyListText}>Movies and shows in your list will appear here</p>
          )
        }
      />
      <Notification state={notificationState} />
      <Loading isVisible={isLoading} />
    </>
  );
};

export default NewList;
