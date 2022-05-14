import { MinusCircleFilled, UserOutlined, DownloadOutlined, UndoOutlined } from "@ant-design/icons";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ListingType, ListType } from "../../pages/list/[id]";
import Container from "../Container/Container";
import ListButton from "../ListButton/ListButton";
import Listing from "../Listing/Listing";
import ListingButton from "../ListingButton/ListingButton";
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

  function saveToAccount() {
    if (!canSave) {
      console.error("error validating list. make sure all required fields are filled in");
      return;
    }

    const newList: ListType = {
      listName: listName,
      listDescription: listDescription,
      ownerUserId: "test",
      listings: listings,
    };
    axios
      .post("http://localhost:4000/createlist", newList)
      .then((res) => router.push(`/list/${res.data}`));
  }

  function saveToLocalStorage() {
    if (!canSave) {
      console.error("error validating list. make sure all required fields are filled in");
      return;
    }

    const newList: ListType = {
      listName: listName,
      listDescription: listDescription,
      ownerUserId: "localstorage",
      listings: listings,
      localStorageId: nanoid(),
    };
    const currentListsString = localStorage.getItem("lists");
    if (currentListsString === null) {
      const lists: ListType[] = [newList];
      const listsString = JSON.stringify(lists);
      localStorage.setItem("lists", listsString);
    } else {
      let currentLists = JSON.parse(currentListsString);
      currentLists.push(newList);
      localStorage.setItem("lists", currentLists);
    }
  }

  useEffect(() => {
    if (listName.length > 0 && listings.length > 0) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [listName, listings]);

  return (
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
            <ListButton
              text="Save to Account"
              Icon={UserOutlined}
              onClick={saveToAccount}
              disabled={!canSave}
            />
            <ListButton
              text="Save to Local Storage"
              Icon={DownloadOutlined}
              onClick={saveToLocalStorage}
              disabled={!canSave}
            />
            <ListButton
              text="Reset"
              Icon={UndoOutlined}
              onClick={() => setListings([])}
              disabled={!canSave}
            />
          </div>
        </>
      }
      body={
        listings.length > 0 ? (
          <div className={styles.list}>
            {listings.map((listing) => (
              <Listing
                key={listing.idWithinList}
                listing={listing}
                buttons={[
                  <ListingButton
                    key={0}
                    Icon={MinusCircleFilled}
                    mouseOverText="Remove From List"
                    onClick={() => onRemoveFromList(listing)}
                  />,
                ]}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyListText}>Movies and shows in your list will appear here</p>
        )
      }
    />
  );
};

export default NewList;
