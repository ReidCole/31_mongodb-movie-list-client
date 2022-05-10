import React, { useState } from "react";
import { Listing } from "../../pages";
import SearchResult from "../SearchResult/SearchResult";
import styles from "./SearchSection.module.css";
import { SearchOutlined, Loading3QuartersOutlined } from "@ant-design/icons";

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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
        let listings: Listing[] = [];
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
            const listing: Listing = {
              id: result.id,
              title: result.media_type === "movie" ? result.title : result.name,
              imgUrl: result.poster_path
                ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                : null,
              mediaType: result.media_type === "movie" ? "movie" : "tv",
            };
            listings.push(listing);
          }
        );

        setSearchResults(listings);
        setLoading(false);
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
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
        <label>
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
          />{" "}
          Include Adult Content
        </label>
      </div>

      {loading ? (
        <div className={styles.loadingDiv}>
          <Loading3QuartersOutlined className={styles.loadingIcon} />
        </div>
      ) : (
        <div className={styles.list}>
          {searchResults.map((result) => (
            <SearchResult key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSection;
