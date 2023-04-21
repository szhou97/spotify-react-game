import React, { useEffect, useState } from "react";
import { Howler, Howl } from "howler";

const AudioPlayer = ({ name, idx, mp3, playing, setPlaying }) => {
  const [player, setPlayer] = useState("");
  const [sound, setSound] = useState(
    new Howl({
      src: [mp3],
      format: ["mp3"],
      loop: true,
      volume: 0.1,
      html5: true,
    })
  );

  const handlePlay = () => {
    if (Object.values(playing).includes(true)) {
      Howler.stop();
    }
    setPlaying({ [idx]: true });
    setPlayer(sound.play());
  };
  const handlePause = (player) => {
    setPlaying({ [idx]: false });
    sound.pause(player);
  };

  useEffect(() => {
    return () => {
      sound.pause(player);
    };
  });

  return (
    <div>
      {!playing[idx] && (
        <button className="trackButton" onClick={handlePlay}>
          play
        </button>
      )}
      {playing[idx] && (
        <button className="trackButton" onClick={(player) => handlePause()}>
          pause
        </button>
      )}
      <span id="trackName">{name}</span>
    </div>
  );
};

export default AudioPlayer;
