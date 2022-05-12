import Image from "next/image";
import { ListingType } from "../../pages";
import unloadedImg from "../../public/img/unloaded-img.png";
import noImg from "../../public/img/no-img.png";
import styles from "./List.module.css";
import ListingButton from "../ListingButton/ListingButton";
import {
  MinusCircleFilled,
  DeleteOutlined,
  SaveOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Listing from "../Listing/Listing";
import { ListType } from "../../pages/list/[id]";
import Container from "../Container/Container";

type Props = {
  list: ListType;
};

const List: React.FC<Props> = ({ list }) => {
  return (
    <Container
      header={
        <>
          <div>
            <h1 className={styles.listTitle}>{list.listName}</h1>
            <p>{list.listDescription}</p>
          </div>
          <div>
            <button>
              <DeleteOutlined />
              delete
            </button>
            <button>
              <SaveOutlined />
              save
            </button>
            <button>
              <ShareAltOutlined />
              share with modal
            </button>
          </div>
          <p>
            todo: include an original version of the list saved in state and an option to revert all
            changes.
          </p>
        </>
      }
      body={
        <div className={styles.list}>
          {list.listings.map((listing) => (
            <Listing
              key={listing.movieDbId}
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
      }
    />
  );
};

export default List;
