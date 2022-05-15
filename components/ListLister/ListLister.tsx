import Link from "next/link";
import Container from "../Container/Container";
import { ListType } from "../ListPage/ListPage";
import styles from "./ListLister.module.css";

type Props = {
  heading: string;
  lists: ListType[];
  linkPrefix: string;
};

const ListLister: React.FC<Props> = ({ lists, heading, linkPrefix }) => {
  return (
    <Container
      header={<h2 className={styles.listTypeHeading}>{heading}</h2>}
      body={
        <div className={styles.lists}>
          {lists.length > 0 ? (
            lists.map((list) => (
              <Link key={list.listId} href={`${linkPrefix}${list.listId}`}>
                <a className={styles.listLink}>{list.listName}</a>
              </Link>
            ))
          ) : (
            <div>
              <p className={styles.noListsText}>No lists</p>
            </div>
          )}
        </div>
      }
    />
  );
};

export default ListLister;
