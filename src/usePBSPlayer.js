// src/usePBSPlayer.js
import { useEffect, useRef } from "react";

let scriptLoaded = false;
let loadPromise = null;

/**
 * usePBSPlayer
 * @param {React.RefObject<HTMLIFrameElement>} iframeRef - ref to the consumer's iframe element
 * @param {Object} options - callbacks and options
 * @param {string} [options.playerScriptUrl] - optional override URL for player.js (if provided, the hook uses this instead of bundled player.js)
 * @param {function} [options.onMediaStart]
 * @param {function} [options.onMediaStop]
 * @param {function} [options.onSeek]
 * @param {function} [options.onPlay]
 * @param {function} [options.onPause]
 * @param {function} [options.onPosition]
 * @returns {React.MutableRefObject|null} playerRef - ref to the created player instance (if available)
 */
export default function usePBSPlayer(iframeRef, options = {}) {
  const playerRef = useRef(null);

  useEffect(() => {
    // Load script only once for the entire app
    if (!scriptLoaded) {
      loadPromise = new Promise((resolve, reject) => {
        try {
          // If user passed a playerScriptUrl, use that; otherwise resolve to the bundled player.js next to the built module
          const scriptUrl = options.playerScriptUrl
            ? options.playerScriptUrl
            : new URL("./player.js", import.meta.url).toString();

          const script = document.createElement("script");
          script.src = scriptUrl;
          script.async = true;

          script.onload = () => {
            scriptLoaded = true;
            resolve();
          };

          script.onerror = (err) => {
            reject(new Error("Failed to load PBS player script: " + err));
          };

          document.body.appendChild(script);
        } catch (err) {
          reject(err);
        }
      });
    }

    (async () => {
      try {
        if (loadPromise) await loadPromise;
        initPlayer();
      } catch (err) {
        // surface to console; consumer can provide custom playerScriptUrl to recover
        // (do not throw inside effect)
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore destroy errors
        }
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  function initPlayer() {
    const iframe = iframeRef && iframeRef.current;
    if (!iframe) {
      // consumer hasn't provided the iframe ref yet
      return;
    }

    if (!window.PBSPartner) {
      // script loaded but global not present
      // eslint-disable-next-line no-console
      console.warn("PBSPartner is not available on window after loading script.");
      return;
    }

    try {
      const PlayerClass = window.PBSPartner;
      const player = new PlayerClass();
      playerRef.current = player;
      player.setPlayer(iframe);

      const {
        onMediaStart,
        onMediaStop,
        onSeek,
        onPlay,
        onPause,
        onPosition
      } = options || {};

      if (onMediaStart) player.on("MediaStart", onMediaStart);
      if (onMediaStop) player.on("MediaStop", onMediaStop);
      if (onSeek) player.on("seek", onSeek);

      if (onPlay)
        player.on("play", async () => {
          try {
            const pos = await player.getPosition();
            onPlay(pos);
          } catch (e) {
            onPlay(null);
          }
        });

      if (onPause)
        player.on("pause", async () => {
          try {
            const pos = await player.getPosition();
            onPause(pos);
          } catch (e) {
            onPause(null);
          }
        });

      if (onPosition) player.on("position", onPosition);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to init PBS player:", err);
    }
  }

  return playerRef;
}
