import React, { useEffect, useState } from "react";
import fetchFromSpotify, { request } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { BsSpotify } from "react-icons/bs";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedNumberOfSongs, setSelectedNumberOfSongs] = useState(1);
  const [selectedNumberOfArtists, setSelectedNumberOfArtists] = useState(2);
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("selectedGenre")) !== null) {
      setSelectedGenre(JSON.parse(localStorage.getItem("selectedGenre")));
    }
    if (JSON.parse(localStorage.getItem("selectedNumberOfArtists")) !== null) {
      setSelectedNumberOfArtists(
        JSON.parse(localStorage.getItem("selectedNumberOfArtists"))
      );
    }
    if (JSON.parse(localStorage.getItem("selectedNumberOfSongs")) !== null) {
      setSelectedNumberOfSongs(
        JSON.parse(localStorage.getItem("selectedNumberOfSongs"))
      );
    }
  }, []);

  const navigate = useNavigate();

  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    setGenres(response.genres);
    setConfigLoading(false);
  };

  useEffect(() => {
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, []);

  if (authLoading || configLoading) {
    return <div>Loading...</div>;
  }
  const playGame = () => {
    if (selectedGenre === "") {
      setError("Must choose a genre");
      return;
    }
    if (selectedNumberOfSongs > 3 || selectedNumberOfSongs < 1) {
      setError("Number of songs must be between 1 and 3");
      return;
    }
    if (selectedNumberOfArtists > 4 || selectedNumberOfArtists < 2) {
      setError("Number of artists must be between 2 and 4");
      return;
    }
    setError("");
    localStorage.setItem("selectedGenre", JSON.stringify(selectedGenre));
    localStorage.setItem(
      "selectedNumberOfArtists",
      JSON.stringify(selectedNumberOfArtists)
    );
    localStorage.setItem(
      "selectedNumberOfSongs",
      JSON.stringify(selectedNumberOfSongs)
    );
    navigate("/game");
  };
  return (
    <div id="main">
      <div id="secondBackground">
      <div id="logoAndHeaderContainer">
        <div id="spotifyLogo">{<BsSpotify />}</div>
        <h1>Who Is Who?</h1>
      </div>
      <h2>
        The game where you guess the artist's name listening to their songs
      </h2>
      <div id="homeInputContainer">
        <div id="element1">
          Genre
          <select
            id="select"
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
          >
            <option value="" />
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div id="element2">
          <label htmlFor="numberOfArtists">
            Number of Artists (between 2 and 4)
          </label>

          <input
            type="number"
            id="numberOfArtists"
            name="numberOfArtists"
            min="2"
            max="4"
            value={selectedNumberOfArtists}
            onChange={(event) => setSelectedNumberOfArtists(event.target.value)}
          ></input>
        </div>
        <div id="element3">
          <label htmlFor="numberOfSongs">
            Number of Songs (between 1 and 3)
          </label>
          <input
            type="number"
            id="numberOfSongs"
            name="numberOfSongs"
            min="1"
            max="3"
            value={selectedNumberOfSongs}
            onChange={(event) => setSelectedNumberOfSongs(event.target.value)}
          ></input>
        </div>
      </div>
      <div id="homeButtonContainer">
        <button id="buttonHome" onClick={playGame}>
          Let's Play!
        </button>
      </div>

      <div className="error">{error}</div>
      </div>
    </div>
  );
};

export default Home;
