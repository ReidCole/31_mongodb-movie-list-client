import Image from "next/image";
import { Listing } from "../../pages";
import styles from "./SearchResult.module.css";
import unloadedImg from "../../public/img/unloaded-img.png";
import noImg from "../../public/img/no-img.png";

type Props = {
  result: Listing;
};

const SearchResult: React.FC<Props> = ({ result }) => {
  return (
    <div className={styles.result}>
      <div className={styles.img}>
        <Image
          src={result.imgUrl ? result.imgUrl : noImg}
          width={486}
          height={730}
          alt={result.title}
          placeholder="blur"
          blurDataURL={unloadedImg.src}
        />
      </div>
      <div>
        <p className={styles.title}>{result.title}</p>
        <p className={styles.mediaType}>{result.mediaType === "movie" ? "Movie" : "TV Show"}</p>
      </div>
    </div>
  );
};

export default SearchResult;
