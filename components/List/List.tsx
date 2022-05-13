import Image from "next/image";
import unloadedImg from "../../public/img/unloaded-img.png";
import noImg from "../../public/img/no-img.png";
import styles from "./List.module.css";
import ListingButton from "../ListingButton/ListingButton";
import {
  MinusCircleFilled,
  DeleteOutlined,
  SaveOutlined,
  ShareAltOutlined,
  EditOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import Listing from "../Listing/Listing";
import { ListingType, ListType } from "../../pages/list/[id]";
import Container from "../Container/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

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
}) => {
  const router = useRouter();

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
      })
      .catch((e) => {
        console.error("error saving list", e);
      });
  }
  function deleteList() {
    console.log("delete list");
    axios.delete(`http://localhost:4000/deletelist/${objectId}`);
  }

  return (
    <Container
      header={
        <>
          <div>
            <h1 className={styles.listTitle}>{listName}</h1>
            <p>{listDescription}</p>
          </div>
          <div>
            <button onClick={deleteList}>
              <DeleteOutlined />
              delete
            </button>
            <button onClick={saveList} disabled={!listEdited}>
              <SaveOutlined />
              save
            </button>
            <button>
              <ShareAltOutlined />
              share with modal
            </button>
            <button>
              <EditOutlined />
              edit name or desc
            </button>
            <button onClick={onRevertChanges} disabled={!listEdited}>
              <UndoOutlined />
              revert changes
            </button>
          </div>
          <p>Created by user {ownerUsername} (send username in server response from /getlist)</p>
          <p>
            todo: include an original version of the list saved in state and an option to revert all
            changes.
          </p>
        </>
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
