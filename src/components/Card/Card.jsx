// src/components/Card/Card.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Card.module.css";
import { fetchRandomPokemon } from "../../utility/Api.js";
import SwipableCard from "./SwipableCard";

const Card = ({ addLikedPokemon, fromLikedPage }) => {
  const [pokemon, setPokemon] = useState(null);
  const [shownPokemonIds, setShownPokemonIds] = useState([]);
  const [likedCount, setLikedCount] = useState(0); // Line 13
  const [loading, setLoading] = useState(true);
  const [showLikedLink, setShowLikedLink] = useState(false);

  /**
   * fetchRandomPokemonData is responsible for fetching a random Pokémon.
   * It's wrapped in useCallback to prevent unnecessary re-creations.
   */
  const fetchRandomPokemonData = useCallback(async () => {
    setLoading(true);
    try {
      const pokemonData = await fetchRandomPokemon(shownPokemonIds);
      setPokemon(pokemonData);
      setShownPokemonIds((prevIds) => [...prevIds, pokemonData.id]);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  }, [shownPokemonIds]);

  /**
   * useEffect to fetch Pokémon data when the component mounts
   * or when fetchRandomPokemonData changes (which happens when shownPokemonIds updates).
   */
  useEffect(() => {
    fetchRandomPokemonData();
  }, [fetchRandomPokemonData]);

  /**
   * useEffect to determine if the "Go to Liked Pokémon" link should be displayed
   * based on the fromLikedPage prop.
   */
  useEffect(() => {
    if (fromLikedPage) {
      setShowLikedLink(true);
    }
  }, [fromLikedPage]);

  /**
   * handleLike adds the current Pokémon to the liked list,
   * increments the liked count, shows the liked link, and fetches a new Pokémon.
   */
  const handleLike = () => {
    if (pokemon) {
      addLikedPokemon(pokemon);
      setLikedCount((prevCount) => prevCount + 1);
      setShowLikedLink(true);
      fetchRandomPokemonData();
    }
  };

  /**
   * handleDislike simply fetches a new Pokémon without altering the liked list.
   */
  const handleDislike = () => {
    fetchRandomPokemonData();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      {loading ? (
        <div className={styles.cardContainer}>
          <h2>Loading...</h2>
        </div>
      ) : (
        <SwipableCard
          pokemon={pokemon}
          handleLike={handleLike}
          handleDislike={handleDislike}
        />
      )}
      {/* Display the liked count */}
      <div className={styles.likedCountContainer}>
        <p>You have liked {likedCount} Pokémon.</p>
      </div>
      {showLikedLink && (
        <div className={styles.likedLinkContainer}>
          <Link to="/liked" className={styles.likedLink}>
            Go to Liked Pokémon
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;
