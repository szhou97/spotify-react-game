import React, { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";

const AudioPlayerContainer = ({ tracks }) => {
  const [playing, setPlaying] = useState({});

  // Set initial playing status to false
  useEffect(() => {
    var dict = {};
    for (let i = 0; i < tracks.length; i++) {
      dict["" + i] = false;
    }
    setPlaying(dict);
  }, []);

  const addAudioPlayers = () => {
    let i = 0;
    let players = [];
    while (i < tracks.length) {
      players.push(
        <div className="track" key={i}>
          <AudioPlayer
            name={tracks[i].name}
            idx={i}
            mp3={tracks[i].preview_url}
            playing={playing}
            setPlaying={setPlaying}
          />
        </div>
      );

      i++;
    }
    return players;
  };

  return <div id="tracksContainer">{addAudioPlayers()}</div>;
};

export default AudioPlayerContainer;
