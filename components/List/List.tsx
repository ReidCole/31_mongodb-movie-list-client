import Image from "next/image";
import { ListingType } from "../../pages";
import unloadedImg from "../../public/img/unloaded-img.png";
import noImg from "../../public/img/no-img.png";
import styles from "./List.module.css";
import ListingButton from "../ListingButton/ListingButton";
import { MinusCircleFilled } from "@ant-design/icons";
import Listing from "../Listing/Listing";

type Props = {
  title: string;
  list: ListingType[];
};

const List: React.FC<Props> = ({ list = [], title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.listHeader}>
        <h1 className={styles.listTitle}>{title}</h1>
        <div>
          <button>s</button>
          <button>s</button>
          <button>s</button>
        </div>
      </div>
      <div className={styles.list}>
        {list.map((listing) => (
          <Listing
            key={listing.id}
            listing={listing}
            buttons={[
              <ListingButton
                key={0}
                Icon={MinusCircleFilled}
                mouseOverText="Remove From List"
                onClick={() => console.log("remove from list")}
              />,
            ]}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
