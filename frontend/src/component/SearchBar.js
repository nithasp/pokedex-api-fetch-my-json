import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";

// Lazy Loading
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../../node_modules/react-lazy-load-image-component/src/effects/blur.css";

// Context
import { PokedexContext } from "../context/PokedexContext";
// Image
import searchIMG from "../images/icon_magnifying_glass.png";

// Loading Image
import spinLoading from "../images/loading-img/Spin-1s-200px.gif";

const SEARCH_DEBOUNCE_MS = 400;
const SCROLL_BOTTOM_THRESHOLD_PX = 60;

const SearchBar = () => {
  const {
    pokemonSearchData,
    pokemonName,
    setPokemonName,
    searchPokemon,
    searchPokemonDropdown,
    searchTerm,
    loadMoreSearchDropdown,
    searchPagination,
    searchLoading,
    searchLoadingMore,
  } = useContext(PokedexContext);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const isFirstRender = useRef(true);
  const searchListRef = useRef(null);

  const hasMore =
    searchPagination &&
    searchPagination.totalPages > 0 &&
    searchPagination.page < searchPagination.totalPages;

  // Infinite scroll inside the dropdown: when the user reaches the bottom,
  // fetch the next page of dropdown-only results (does not affect the main grid).
  const handleSearchListScroll = (event) => {
    if (!hasMore || searchLoadingMore) return;
    const el = event.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD_PX) {
      loadMoreSearchDropdown();
    }
  };

  const handleSearch = (value) => {
    setPokemonName(value);
    setShowSearchBar(value.length > 0);
  };

  const handleCloseSearch = (event) => {
    const elem = document.querySelector(".searchbar-container");
    if (elem && !elem.contains(event.target)) {
      setShowSearchBar(false);
    }
  };

  // Submit (Enter / magnifier click) is the ONLY path that replaces the
  // main pokemon list with the search results.
  const handleSubmitSearch = () => {
    const term = pokemonName.trim();
    if (term !== searchTerm) {
      searchPokemon(term);
    }
    setShowSearchBar(false);
  };

  // Debounced search: hits the API after the user stops typing.
  // Only updates the dropdown list — the main pokemon grid is untouched.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handle = setTimeout(() => {
      searchPokemonDropdown(pokemonName);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [pokemonName, searchPokemonDropdown]);

  useEffect(() => {
    document.addEventListener("mousedown", handleCloseSearch);
    return () => {
      document.removeEventListener("mousedown", handleCloseSearch);
    };
  }, []);

  return (
    <WrapSearchBar className="searchbar-container">
      <input
        type="text"
        value={pokemonName}
        placeholder="Search for Pokemon"
        className="searchbar"
        onClick={() => {
          pokemonName ? setShowSearchBar(true) : setShowSearchBar(false);
        }}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        onKeyDown={(event) => event.key === "Enter" && handleSubmitSearch()}
      />
      <div className="wrap-search-image" onClick={() => handleSubmitSearch()}>
        <img src={searchIMG} alt="search-icon" />
      </div>

      {pokemonName && showSearchBar && (
        <div
          className="pokemon-search-list"
          ref={searchListRef}
          onScroll={handleSearchListScroll}
        >
          {searchLoading ? (
            <div className="search-list-status loading center">
              <img src={spinLoading} alt="searching" />
              <span>Searching...</span>
            </div>
          ) : pokemonSearchData.length === 0 ? (
            <div className="pokemon-item no-results">
              <div className="pokemon-name">
                <h3>No results</h3>
              </div>
            </div>
          ) : (
            <>
              {pokemonSearchData.map((value) => {
                const firstCharUpperCase = value.name
                  .split(" ")
                  .map(
                    (char) => char.charAt(0).toUpperCase() + char.substring(1),
                  )
                  .join(" ");

                const thumbnail =
                  (value.image && (value.image.detail || value.image.full)) ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value.id}.png`;

                return (
                  <div
                    className="pokemon-item"
                    onClick={() => {
                      setPokemonName(value.name);
                      setShowSearchBar(false);
                    }}
                    key={value.id}
                  >
                    <div className="pokemon-thumbnail">
                      <LazyLoadImage
                        src={thumbnail}
                        alt={firstCharUpperCase}
                        className="pokemon-sprite"
                        effect="blur"
                        placeholderSrc={spinLoading}
                      />
                    </div>
                    <div className="pokemon-name">
                      <h3>{firstCharUpperCase}</h3>
                    </div>
                  </div>
                );
              })}

              {searchLoadingMore && (
                <div className="search-list-status loading">
                  <img src={spinLoading} alt="loading-more" />
                  <span>Loading more...</span>
                </div>
              )}
              {!searchLoadingMore && !hasMore && (
                <div className="search-list-status end">
                  <span>No more results</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </WrapSearchBar>
  );
};

const WrapSearchBar = styled.div`
  position: relative;
  width: 90%;
  max-width: 500px;
  margin: 0 auto;

  input {
    width: 100%;
    max-height: 40px;
    outline: none;
    padding: 10px;
    font-size: 21px;
    text-transform: capitalize;
    letter-spacing: 0.5px;
  }

  .wrap-search-image {
    position: absolute;
    right: 0px;
    top: 50%;
    width: 70px;
    height: 97%;
    transform: translateY(-50%);
    background: #b4ebff;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background: #b2ecff;
    }

    img {
      height: 25px;
      width: 25px;
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
    }
  }

  .pokemon-search-list {
    background: #0d1117;
    width: 100%;
    position: absolute;
    z-index: 1;
    max-height: 389px;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 12px;
    }
    ::-webkit-scrollbar-track {
      background: #d6dbe4;
    }
    ::-webkit-scrollbar-thumb {
      background: #6a6c71;
    }

    .pokemon-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      cursor: pointer;
      border-top: none !important;
      border: 1.2px solid #8b949e;

      .pokemon-name {
        padding: 20px 0;
        h3 {
          margin: 0;
        }
      }
    }

    .search-list-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 16px;
      color: #c9d1d9;
      font-size: 14px;
      letter-spacing: 0.5px;
      border-top: 1px solid #8b949e;
      background: #0d1117;

      img {
        width: 22px;
        height: 22px;
      }
    }

    .search-list-status.end {
      color: #8b949e;
      font-style: italic;
    }

    .search-list-status.center {
      min-height: 120px;
      border-top: none;
      flex-direction: column;
      gap: 6px;

      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  .pokemon-thumbnail {
    width: 100px;
    height: 100px;
  }
  .pokemon-sprite {
    width: 100%;
    height: 100%;
  }
  .lazy-load-image-background.blur {
    width: 100px;
    height: 100px;
    filter: blur(0.1px);
    background-size: 50% 50% !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }
  @media (max-width: 450px) {
    input {
      font-size: 5vw;
    }
  }
`;

export default SearchBar;
