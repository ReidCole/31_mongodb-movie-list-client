import Image from "next/image";
import { Listing } from "../../pages";
import styles from "./SearchResult.module.css";

type Props = {
  result: Listing;
};

const SearchResult: React.FC<Props> = ({ result }) => {
  return (
    <div className={styles.result}>
      <div className={styles.img}>
        <Image src={result.imgUrl} width={486} height={730} alt={result.title} />
      </div>
      <div>
        <p className={styles.title}>{result.title}</p>
        <p className={styles.mediaType}>{result.mediaType === "movie" ? "Movie" : "TV Show"}</p>
      </div>
    </div>
  );
};

export default SearchResult;
