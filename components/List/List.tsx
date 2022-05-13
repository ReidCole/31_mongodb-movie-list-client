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
} from "@ant-design/icons";
import Listing from "../Listing/Listing";
import { ListingType, ListType } from "../../pages/list/[id]";
import Container from "../Container/Container";
import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  listObjectId: string | null;
};

const List: React.FC<Props> = ({ listObjectId }) => {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [listings, setListings] = useState<ListingType[]>([]);
  const [ownerUserId, setOwnerUserId] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [objectId, setObjectId] = useState("");

  function removeFromList(listing: ListingType) {
    setListings((prev) => prev.filter((l) => l.idWithinList !== listing.idWithinList));
  }

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

  useEffect(() => {
    if (listObjectId === null) return;

    axios.get(`http://localhost:4000/getlist/${listObjectId}`).then((res) => {
      const data = res.data;

      setListName(data.listName);
      setListDescription(data.listDescription);
      setListings(data.listings);
      setOwnerUserId(data.ownerUserId ? data.ownerUserId : "fix later");

      setObjectId(data._id);
    });
  }, [listObjectId]);

  if (listings.length === 0) return <div>Loading...</div>;

  return (
    <Container
      header={
        <>
          <div>
            <h1 className={styles.listTitle}>{listName}</h1>
            <p>{listDescription}</p>
          </div>
          <div>
            <button>
              <DeleteOutlined />
              delete
            </button>
            <button onClick={saveList}>
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
              key={listing.movieDbId}
              listing={listing}
              buttons={[
                <ListingButton
                  key={0}
                  Icon={MinusCircleFilled}
                  mouseOverText="Remove From List"
                  onClick={() => removeFromList(listing)}
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
