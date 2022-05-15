import Image from "next/image";
import Listing from "../Listing/Listing";
import styles from "./AddCustomListing.module.css";
import noImg from "../../public/img/no-img.png";
import unloadedImg from "../../public/img/unloaded-img.png";
import { useState } from "react";
import ListingButton from "../ListingButton/ListingButton";
import { PlusCircleFilled } from "@ant-design/icons";
import { ListingType } from "../ListPage/ListPage";
import { nanoid } from "nanoid";

type Props = {
  onAddToList(listing: ListingType): void;
};

const AddCustomListing: React.FC<Props> = ({ onAddToList }) => {
  const [title, setTitle] = useState<string>("");
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");

  function addToList() {
    const listing: ListingType = {
      title: title,
      mediaType: mediaType,
      imgUrl: null,
      movieDbId: null,
      idWithinList: nanoid(),
    };
    onAddToList(listing);
  }

  return (
    <div className={styles.listing}>
      <div className={styles.leftSideContainer}>
        <div className={styles.img}>
          <Image
            src={noImg}
            width={486}
            height={730}
            alt=""
            placeholder="blur"
            blurDataURL={unloadedImg.src}
          />
        </div>
        <div className={styles.inputsDiv}>
          <input
            className={styles.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
          />
          <select
            className={styles.mediaType}
            value={mediaType === "movie" ? "movie" : "tv"}
            onChange={(e) => {
              const val = e.target.value === "movie" ? "movie" : "tv";
              setMediaType(val);
            }}
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
        </div>
      </div>

      <div className={styles.rightSideContainer}>
        <ListingButton
          Icon={PlusCircleFilled}
          mouseOverText="Add To List"
          onClick={addToList}
          disabled={title.length === 0}
        />
      </div>
    </div>
  );
};

export default AddCustomListing;
