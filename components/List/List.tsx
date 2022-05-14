import styles from "./List.module.css";
import ListingButton from "../ListingButton/ListingButton";
import {
  MinusCircleFilled,
  DeleteOutlined,
  SaveOutlined,
  EditOutlined,
  UndoOutlined,
  LinkOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Listing from "../Listing/Listing";
import Container from "../Container/Container";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ListButton from "../ListButton/ListButton";
import { ListingType, ListType } from "../ListPage/ListPage";

type Props = {
  listName: string;
  setListName(val: string): void;
  listDescription: string;
  setListDescription(val: string): void;
  listings: ListingType[];
  setListings(listings: ListingType[]): void;
  onRemoveFromList(listing: ListingType): void;
  listId: string;
  ownerUsername: string;
  listEdited: boolean;
  onRevertChanges(): void;
  onSaved(): void;
  listLocation: "localStorage" | "server";
};

const List: React.FC<Props> = ({
  listName,
  setListName,
  listDescription,
  setListDescription,
  listings,
  setListings,
  listId,
  ownerUsername,
  onRemoveFromList,
  listEdited,
  onRevertChanges,
  onSaved,
  listLocation,
}) => {
  const router = useRouter();
  const [editingList, setEditingList] = useState(false);

  function saveList() {
    console.log("save list", listId);
    if (listLocation === "server") {
      const data = {
        listName: listName,
        listDescription: listDescription,
        listings: listings,
      };
      axios
        .patch(`http://localhost:4000/updatelist/${listId}`, data)
        .then((res) => {
          console.log("list saved successfully");
          onSaved();
        })
        .catch((e) => {
          console.error("error saving list", e);
        });
    } else {
      const listToSave: ListType = {
        listName: listName,
        listDescription: listDescription,
        listings: listings,
        localStorageId: listId,
        ownerUserId: "localstorage",
      };
      const currentListsString = localStorage.getItem("lists");
      if (currentListsString === null) {
        const newListsString = JSON.stringify([listToSave]);
        localStorage.setItem("lists", newListsString);
      } else {
        let currentLists = JSON.parse(currentListsString);
        const index = currentLists.findIndex(
          (l: { localStorageId: string | undefined }) =>
            l.localStorageId === listToSave.localStorageId
        );
        // if list already exists in local storage
        if (index !== -1) {
          currentLists[index] = listToSave;
        } else {
          currentLists.push(listToSave);
        }

        const newListsString = JSON.stringify(currentLists);
        localStorage.setItem("lists", newListsString);
        onSaved();
      }
    }
  }

  function deleteList() {
    console.log("delete list");
    if (listLocation === "server") {
      axios.delete(`http://localhost:4000/deletelist/${listId}`).then((res) => {
        console.log("deleted successfully");
        router.push("/");
      });
    } else {
      const currentListsString = localStorage.getItem("lists");
      if (currentListsString === null) {
        console.error("Tried to delete list but lists item in local storage is null");
        return;
      }
      let currentLists = JSON.parse(currentListsString);
      currentLists = currentLists.filter(
        (list: { localStorageId: string }) => list.localStorageId !== listId
      );
      const newListsString = JSON.stringify(currentLists);
      localStorage.setItem("lists", newListsString);
      router.push("/");
    }
  }

  return (
    <Container
      header={
        <div className={styles.header}>
          <div className={styles.detailsSection}>
            {editingList ? (
              <>
                <input
                  className={styles.editTitle}
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
                <textarea
                  className={styles.editDescription}
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                  rows={4}
                  placeholder="Description..."
                />
                <ListButton
                  text="Finish Editing"
                  Icon={CheckOutlined}
                  onClick={() => setEditingList(false)}
                  disabled={listName.length === 0}
                />
              </>
            ) : (
              <>
                <h1 className={styles.listTitle}>{listName}</h1>
                <p>{listDescription}</p>
                <p>
                  Created by user {ownerUsername} (send username in server response from /getlist)
                </p>
              </>
            )}
          </div>

          <div className={styles.buttonSection}>
            <ListButton
              text="Save"
              Icon={SaveOutlined}
              onClick={saveList}
              disabled={!listEdited || editingList}
            />
            <ListButton
              text="Edit Details"
              Icon={EditOutlined}
              onClick={() => setEditingList(true)}
              disabled={editingList}
            />
            <ListButton
              text="Undo Changes"
              Icon={UndoOutlined}
              onClick={onRevertChanges}
              disabled={!listEdited || editingList}
            />
            {listLocation === "server" && (
              <ListButton
                text="Copy Link"
                Icon={LinkOutlined}
                onClick={() => {
                  navigator.clipboard.writeText(`htttp://localhost:3000/list/${listId}`);
                }}
              />
            )}

            <ListButton text="Delete" Icon={DeleteOutlined} onClick={deleteList} />
          </div>
        </div>
      }
      body={
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
      }
    />
  );
};

export default List;
