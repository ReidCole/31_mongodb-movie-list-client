import Image from "next/image";
import { Listing } from "../../pages";
import unloadedImg from "../../public/img/unloaded-img.png";
import noImg from "../../public/img/no-img.png";
import styles from "./List.module.css";

type Props = {
  list: Listing[];
};

const List: React.FC<Props> = ({ list = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.listHeader}>
        <h1 className={styles.listTitle}>Heading</h1>
      </div>
      <div className={styles.list}>
        {list.map((listing) => (
          <div key={listing.id} className={styles.listing}>
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
              <p className={styles.mediaType}>
                {listing.mediaType === "movie" ? "Movie" : "TV Show"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
