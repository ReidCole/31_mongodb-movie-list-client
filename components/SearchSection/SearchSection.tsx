import React, { useState } from "react";
import styles from "./SearchSection.module.css";
import {
  SearchOutlined,
  Loading3QuartersOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import Listing from "../Listing/Listing";
import ListingButton from "../ListingButton/ListingButton";
import Container from "../Container/Container";
import { ListingType } from "../ListPage/ListPage";
import Button from "../Button/Button";
import AddCustomListing from "../AddCustomListing/AddCustomListing";
import useNotificationState from "../../hooks/useNotificationState";
import Notification from "../Notification/Notification";
import axios from "axios";

type Props = {
  onAddToList(listing: ListingType): void;
};

const SearchSection: React.FC<Props> = ({ onAddToList }) => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [addingCustomListing, setAddingCustomListing] = useState<boolean>(false);
  const [notificationState, showNotification] = useNotificationState();

  function fetchSearchResults() {
    if (query.length === 0) return console.error("search query length is 0");
    setNoResults(false);
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/searchmovies/${query}`)
      .then((res) => {
        const data = res.data;
        if (typeof data.results === "undefined") {
          showNotification(
            "Error: Couldn't reach The Movie DB servers. Please try again later.",
            "red"
          );
          setLoading(false);
          setNoResults(true);
          return console.error("results returned undefined");
        }
        let listings: ListingType[] = [];
        data.results.map(
          (result: {
            id: number;
            title: string;
            name: string;
            poster_path: string | null;
            media_type: string;
          }) => {
            if (result.media_type === "person") {
              return;
            }
            const listing: ListingType = {
              movieDbId: result.id,
              title: result.media_type === "movie" ? result.title : result.name,
              imgUrl: result.poster_path
                ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                : null,
              mediaType: result.media_type === "movie" ? "movie" : "tv",
              idWithinList: null,
            };
            listings.push(listing);
          }
        );
        if (listings.length === 0) {
          setNoResults(true);
        } else {
          setSearchResults(listings);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        showNotification("Error: " + e.message, "red");
        setLoading(false);
        setNoResults(true);
      });
  }

  return (
    <>
      <Container
        header={
          <>
            <h2 className={styles.heading}>Search for Movies and TV Shows</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchSearchResults();
              }}
              className={styles.searchForm}
            >
              <input
                className={styles.searchInput}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
              />
              <button type="submit" className={styles.searchButton}>
                <SearchOutlined />
              </button>
            </form>

            {!addingCustomListing && (
              <Button onClick={() => setAddingCustomListing(true)}>
                <PlusOutlined /> Add Custom Movie
              </Button>
            )}

            {addingCustomListing && <AddCustomListing onAddToList={onAddToList} />}
          </>
        }
        body={
          noResults ? (
            <div className={styles.noSearchText}>No results were found</div>
          ) : loading ? (
            <div className={styles.loadingDiv}>
              <Loading3QuartersOutlined className={styles.loadingIcon} />
            </div>
          ) : searchResults.length > 0 ? (
            <div className={styles.list}>
              {searchResults.map((result) => (
                <Listing
                  key={result.movieDbId}
                  listing={result}
                  buttons={[
                    <ListingButton
                      key={0}
                      Icon={PlusCircleFilled}
                      mouseOverText="Add To List"
                      onClick={() => onAddToList(result)}
                    />,
                  ]}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noSearchText}>Search results will appear here</div>
          )
        }
      />
      <Notification state={notificationState} />
    </>
  );
};

export default SearchSection;
