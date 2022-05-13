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
import { ListingType } from "../../pages/list/[id]";
import Container from "../Container/Container";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ListButton from "../ListButton/ListButton";

type Props = {
  listName: string;
  setListName(val: string): void;
  listDescription: string;
  setListDescription(val: string): void;
  listings: ListingType[];
  setListings(listings: ListingType[]): void;
  onRemoveFromList(listing: ListingType): void;
  objectId: string;
  ownerUsername: string;
  listEdited: boolean;
  onRevertChanges(): void;
  onSaved(): void;
};

const List: React.FC<Props> = ({
  listName,
  setListName,
  listDescription,
  setListDescription,
  listings,
  setListings,
  objectId,
  ownerUsername,
  onRemoveFromList,
  listEdited,
  onRevertChanges,
  onSaved,
}) => {
  const router = useRouter();
  const [editingList, setEditingList] = useState(false);

  function saveList() {
    console.log("save list", objectId);
    const data = {
      listName: listName,
      listDescription: listDescription,
      listings: listings,
    };
    axios
      .patch(`http://localhost:4000/updatelist/${objectId}`, data)
      .then((res) => {
        console.log("list saved successfully");
        onSaved();
      })
      .catch((e) => {
        console.error("error saving list", e);
      });
  }

  function deleteList() {
    console.log("delete list");
    axios.delete(`http://localhost:4000/deletelist/${objectId}`).then((res) => {
      console.log("deleted successfully");
      router.push("/");
    });
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
            <ListButton
              text="Copy Link"
              Icon={LinkOutlined}
              onClick={() => {
                navigator.clipboard.writeText(`htttp://localhost:3000/list/${objectId}`);
              }}
            />
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
