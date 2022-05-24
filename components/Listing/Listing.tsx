import Image from "next/image";
import styles from "./Listing.module.css";
import unloadedImg from "../../public/img/unloaded-img.png";
import noImg from "../../public/img/no-img.png";
import { ListingType } from "../ListPage/ListPage";
import { DragEventHandler } from "react";

type Props = {
  listing: ListingType;
  buttons: JSX.Element[];
  canReorder?: boolean;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onDragOver?: DragEventHandler<HTMLDivElement>;
  onDrop?: DragEventHandler<HTMLDivElement>;
};

const Listing: React.FC<Props> = ({
  listing,
  buttons,
  canReorder = false,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      className={`${styles.listing} ${canReorder ? styles.reorder : ""}`}
      draggable={canReorder}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={styles.leftSideContainer}>
        <div className={styles.img}>
          <Image
            src={listing.imgUrl ? listing.imgUrl : noImg}
            width={486}
            height={730}
            alt={listing.title}
            placeholder="blur"
            blurDataURL={unloadedImg.src}
          />
        </div>
        <div>
          <p className={styles.title}>{listing.title}</p>
          <p className={styles.mediaType}>{listing.mediaType === "movie" ? "Movie" : "TV Show"}</p>
        </div>
      </div>

      <div className={styles.rightSideContainer}>{buttons}</div>
    </div>
  );
};

export default Listing;
