import React, { useState } from "react";
import styles from "./SearchSection.module.css";
import { SearchOutlined, Loading3QuartersOutlined, PlusCircleFilled } from "@ant-design/icons";
import Listing from "../Listing/Listing";
import ListingButton from "../ListingButton/ListingButton";
import Container from "../Container/Container";
import { ListingType } from "../ListPage/ListPage";

type Props = {
  onAddToList(listing: ListingType): void;
};

const SearchSection: React.FC<Props> = ({ onAddToList: addToList }) => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ListingType[]>([]);
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  function fetchSearchResults() {
    if (query.length === 0) {
      console.error("search query length is 0");
      return;
    }
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=1d4d3e32919168fb8e210e70ed956f24&language=en-US&query=${query}&page=1&include_adult=${
        includeAdult ? "true" : "false"
      }`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json.results);
        let listings: ListingType[] = [];
        json.results.map(
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

        setSearchResults(listings);
        setLoading(false);
      });
  }

  return (
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
            />
            <button type="submit" className={styles.searchButton}>
              <SearchOutlined />
            </button>
          </form>
          <label className={styles.adultContentLabel}>
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
            />{" "}
            <p>Include Adult Content</p>
          </label>
        </>
      }
      body={
        loading ? (
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
                    onClick={() => addToList(result)}
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
  );
};

export default SearchSection;
