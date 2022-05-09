import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import useSWR, { Fetcher } from "swr";
import SearchResult from "../components/SearchResult/SearchResult";

// todo: use swr for initial load of list, not for search results

export type Listing = {
  title: string;
  imgUrl: string;
  id: number;
  mediaType: "movie" | "tv";
};

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);

  function fetchMovies() {
    if (query.length === 0) {
      console.error("search query length is 0");
      return;
    }
    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=1d4d3e32919168fb8e210e70ed956f24&language=en-US&query=${query}&page=1&include_adult=${
        includeAdult ? "true" : "false"
      }`
    )
      .then((res) => res.json())
      .then((json) => {
        let listings: Listing[] = [];
        json.results.map(
          (result: {
            id: number;
            title: string;
            name: string;
            poster_path: string;
            media_type: string;
          }) => {
            if (result.media_type === "person") {
              return;
            }
            const listing: Listing = {
              id: result.id,
              title: result.media_type === "movie" ? result.title : result.name,
              imgUrl: `https://image.tmdb.org/t/p/w500/${result.poster_path}`,
              mediaType: result.media_type === "movie" ? "movie" : "tv",
            };
            listings.push(listing);
          }
        );

        setSearchResults(listings);
      });
  }

  return (
    <>
      <Head>
        <title>Movie List Maker</title>
      </Head>

      <main>
        <h1 className={styles.title}>Movie List Maker</h1>

        <div className={styles.container}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
          <label>
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
            />{" "}
            Include Adult Content
          </label>
          <button onClick={fetchMovies}>Search</button>
          <div className={styles.searchResultsList}>
            {searchResults.map((result) => (
              <SearchResult key={result.id} result={result} />
            ))}
          </div>
        </div>

        <div className={styles.container}>
          <h2 className={styles.listHeading}>List</h2>

          <div></div>
        </div>
      </main>
    </>
  );
};

export default Home;
