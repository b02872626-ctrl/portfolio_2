import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./music-player.css";

// Paths are URL-encoded because some file names have spaces and odd characters.
const tracks = [
  { title: "Afer Yemegneshal", artist: "Local playlist", src: "/assets/music/Afer-yemegneshal.m4a" },
  { title: "Fetsum Denq Ledj Nesh", artist: "Local playlist", src: "/assets/music/Fetsum-denq-ledj-nesh.m4a" },
  {
    title: "Fikratchin",
    artist: "Menelik Wossenatchew, Mulatu Astatke",
    src: "/assets/music/Fikratchin%20with%20Menelik%20Wossenatchew%20-%20Mulatu%20Astatke.mp3",
  },
  {
    title: "I Faram Gami I Faram",
    artist: "Mulatu Astatke",
    src: "/assets/music/I%20Faram%20Gami%20I%20Faram%20-%20Mulatu%20Astatke.mp3",
  },
  {
    title: "Kalorifer",
    artist: "Mulatu Astatke",
    src: "/assets/music/Mulatu%20Astatke%20-%20Mulatu%20-%20kalorifer.mp3",
  },
  {
    title: "Yegelle Tezeta",
    artist: "Mulatu Astatke",
    src: "/assets/music/Y%EF%BF%BDgell%EF%BF%BD%20Tezeta%20-%20Mulatu%20Astatke.mp3",
  },
  {
    title: "Yekermo Sew",
    artist: "Mulatu Astatke",
    src: "/assets/music/Y%EF%BF%BDk%EF%BF%BDrmo%20S%EF%BF%BDw%20-%20Mulatu%20Astatke.mp3",
  },
];

const Bars = ({ playing }) => (
  <span className={`music-bars${playing ? " is-playing" : ""}`} aria-hidden="true">
    <span />
    <span />
    <span />
  </span>
);

const SpeakerIcon = ({ muted }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2.5 7v4h3l4 3V4l-4 3h-3z" fill="currentColor" />
    {muted ? (
      <path d="M12 7l4 4M16 7l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ) : (
      <path
        d="M12 6.5a3.5 3.5 0 010 5M14 4.5a6.4 6.4 0 010 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const PlayPauseIcon = ({ playing }) =>
  playing ? (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="10.5" y="3" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M5 3.5v11l9-5.5-9-5.5z" fill="currentColor" />
    </svg>
  );

// Same spring as the clock pill so the two islands move alike.
const islandSpring = { type: "spring", stiffness: 380, damping: 28 };

export default function MusicPlayer(motionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const shellRef = useRef(null);
  const playOnLoadRef = useRef(false);

  const track = tracks[index];
  const isMuted = muted || volume === 0;

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!shellRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // A new track loads; keep playing if we were playing.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    if (playOnLoadRef.current) {
      playOnLoadRef.current = false;
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [index]);

  const playTrack = (nextIndex) => {
    const normalized = (nextIndex + tracks.length) % tracks.length;
    if (normalized === index) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
      return;
    }
    playOnLoadRef.current = true;
    setIndex(normalized);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  };

  const toggleMute = () => {
    if (isMuted) {
      setMuted(false);
      if (volume === 0) setVolume(60);
    } else {
      setMuted(true);
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    const next = Number(event.target.value);
    setCurrentTime(next);
    if (audio) audio.currentTime = next;
  };

  const handleVolume = (event) => {
    const next = Number(event.target.value);
    setVolume(next);
    setMuted(next === 0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const shownVolume = isMuted ? 0 : volume;

  return (
    <motion.div className="music-shell" ref={shellRef} {...motionProps}>
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={() => playTrack(index + 1)}
      />

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        className={`music-tab${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="music-card"
        aria-label={isOpen ? "Close music player" : "Open music player"}
      >
        <Bars playing={isPlaying} />
        <span className="music-tab__label">{isPlaying ? "Now playing" : "Music"}</span>
      </motion.button>

      <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="music-card"
          id="music-card"
          role="dialog"
          aria-label="Music player"
          style={{ x: "-50%", transformOrigin: "50% 0%" }}
          initial={{ opacity: 0, scale: 0.4, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: islandSpring }}
          exit={{ opacity: 0, scale: 0.4, y: -16, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
        >
          <span className="music-card__tab">Playlist · {tracks.length}</span>
          <div className="music-card__body">
            <div className="music-card__now">
              <span className="music-card__cover" aria-hidden="true" />
              <span className="music-card__copy">
                <span className="music-card__title">{track.title}</span>
                <span className="music-card__artist">{track.artist}</span>
              </span>
              <span className="music-card__buttons">
                <button
                  type="button"
                  className="tab-button tab-button--icon music-card__mute"
                  onClick={toggleMute}
                  aria-pressed={isMuted}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  <SpeakerIcon muted={isMuted} />
                </button>
                <button
                  type="button"
                  className="tab-button tab-button--icon music-card__play"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <PlayPauseIcon playing={isPlaying} />
                </button>
              </span>
            </div>

            <input
              type="range"
              className="music-card__progress"
              min="0"
              max={duration || 1}
              step="0.1"
              value={Math.min(currentTime, duration || 1)}
              onChange={handleSeek}
              aria-label="Track position"
              style={{ "--fill": `${progress}%` }}
            />

            <label className="music-card__volume">
              <span className="music-card__volume-label">Volume</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={shownVolume}
                onChange={handleVolume}
                aria-label="Volume"
              />
              <span className="music-card__volume-value">{shownVolume}</span>
            </label>

            <ol className="music-card__list" aria-label="Playlist">
              {tracks.map((item, itemIndex) => (
                <li key={item.src}>
                  <button
                    type="button"
                    className={itemIndex === index ? "is-current" : undefined}
                    aria-current={itemIndex === index ? "true" : undefined}
                    onClick={() => playTrack(itemIndex)}
                  >
                    <span className="music-card__num">{String(itemIndex + 1).padStart(2, "0")}</span>
                    <span className="music-card__track">{item.title}</span>
                    <span className="music-card__track-artist">{item.artist}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
