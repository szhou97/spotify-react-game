import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchFromSpotify from "../services/api";
import AudioPlayerContainer from "./AudioPlayerContainer";
import "../styles/Game.css";

const Game = () => {
  const [fetchedArtists, setFetchedArtists] = useState([]);
  const [gameArtists, setGameArtists] = useState([]);
  const [guessedArtist, setGuessedArtist] = useState("");
  const [correctArtist, setCorrectArtist] = useState("");
  const [fetchedTracks, setFetchedTracks] = useState([]);
  const [gameTracks, setGameTracks] = useState([]);

  const [guessNotification, setGuessNotification] = useState("");

  const navigate = useNavigate();
  const accessToken = JSON.parse(
    localStorage.getItem("whos-who-access-token")
  ).value;
  const selectedGenre = JSON.parse(localStorage.getItem("selectedGenre"));
  const selectedNumberOfArtists = JSON.parse(
    localStorage.getItem("selectedNumberOfArtists")
  );
  const selectedNumberOfTracks = JSON.parse(
    localStorage.getItem("selectedNumberOfSongs")
  );

  const [guesses, setGuesses] = useState(selectedNumberOfArtists - 1);

  // Fetches list of 50 artists from spotify based on the user selected genre
  const fetchArtists = async (token) => {
    const response = await fetchFromSpotify({
      token: token,
      endpoint: `search?q=genre=${selectedGenre}&type=artist&limit=50`,
    });
    setFetchedArtists(response.artists.items);
  };

  // Fetch the artists on initial page load
  useEffect(() => {
    fetchArtists(accessToken);
  }, []);

  // Once array of artists have been fetched from spotify, shuffle them and set game artists based on selected number by user
  useEffect(() => {
    const shuffled = shuffleArtists(fetchedArtists);
    setGameArtists(shuffled.slice(0, selectedNumberOfArtists));
  }, [fetchedArtists]);

  const shuffleArtists = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  // Chooses a random correct artist to fetch the tracks for
  useEffect(() => {
    setCorrectArtist(
      gameArtists[Math.floor(Math.random() * gameArtists.length)]
    );
  }, [gameArtists]);

  //Fetches the tracks for the correct artist
  useEffect(() => {}, [correctArtist]);

  // Chooses a random correct artist to fetch the tracks for
  useEffect(() => {
    console.log("after", fetchedArtists);
    setCorrectArtist(
      gameArtists[Math.floor(Math.random() * gameArtists.length)]
    );
  }, [gameArtists]);

  // TRACKS
  const fetchTracks = async (token) => {
    const response = await fetchFromSpotify({
      token: token,
      endpoint: `artists/${correctArtist.id}/top-tracks?market=US`,
    });
    setFetchedTracks(response.tracks);
  };

  //Fetches the tracks for the correct artist
  useEffect(() => {
    fetchTracks(accessToken);
  }, [correctArtist]);

  useEffect(() => {
    shuffleTracks(fetchedTracks);
    setGameTracks(fetchedTracks.slice(0, selectedNumberOfTracks));
  }, [fetchedTracks, selectedNumberOfTracks]);

  const shuffleTracks = (array) => {
    if (array.length <= 1) return array;
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    setFetchedTracks(array);
  };

  const handleSubmit = () => {
    if (guessedArtist === "") {
      setGuessNotification("Must choose an artist.");
      return;
    }
    if (guessedArtist !== correctArtist.name && guesses === 2) {
      setGuessNotification(
        `Incorrect! ${guessedArtist} is not the correct artist. You have 1 guess left.`
      );
      setGuesses(guesses - 1);
      return;
    }
    if (guessedArtist !== correctArtist.name && guesses > 1) {
      setGuessNotification(
        `Incorrect! ${guessedArtist} is not the correct artist. You have ${
          guesses - 1
        } guesses left.`
      );
      setGuesses(guesses - 1);
      return;
    }

    if (guessedArtist !== correctArtist.name && guesses === 1) {
      setGuessNotification(
        `Incorrect! You have run out of guesses. ${correctArtist.name} is the correct artist. Redirecting to home page.....`
      );
      setTimeout(() => navigate("/"), 3000);
    }
    if (guessedArtist === correctArtist.name) {
      setGuessNotification(
        `${correctArtist.name} is correct! Redirecting to home page.....`
      );
      setTimeout(() => navigate("/"), 3000);
    }
  };

  const updateArtistChoice = (e) => {
    setGuessedArtist(e.target.value);
  };

  return (
    <div id="gamePage">
      <h1 id="gamePageHeader">Genre: {selectedGenre}</h1>
      <main id="gameContainer">
        <section id="trackSection">
          <h2>Tracks</h2>
          <AudioPlayerContainer tracks={gameTracks} />
        </section>
        <section id="artistChoiceSection">
          <h2>Select your artist choice</h2>
          {gameArtists.map((artist) => {
            return (
              <div key={artist.id} className="artist">
                <label htmlFor="artistRadioButton">
                  <input
                    type="radio"
                    name="artistRadioButton"
                    onChange={updateArtistChoice}
                    value={artist.name}
                  />
                  {artist.name}
                </label>
                <img className="artist-image" src={artist.images[0].url}></img>
              </div>
            );
          })}
          <div id="artistSectionBtnContainer">
            <button onClick={handleSubmit}>Submit</button>
            <button id="changeConfigBtn" onClick={() => navigate("/")}>
              Change Configurations
            </button>
          </div>
        </section>
      </main>
      <div id="guessContainer">
        <h2 id="guessNotification">{guessNotification}</h2>
      </div>
    </div>
  );
};

export default Game;
