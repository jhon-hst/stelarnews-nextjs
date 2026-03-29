/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import AdBanner from "@/components/ads/AdBanner";
import { useEffect, useRef, useState, useCallback } from "react";

export interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  likes: string;
  comments: string;
  author: string;
}

const DEFAULT_VIDEOS = [
  { id: "1", videoId: "ldSVhw1Nv50", title: "Real life transforming Cinderella dress! 👗😲", likes: "7.9M", comments: "289K", author: "@JustinFlom" },
  { id: "2", videoId: "JfbnpYLe3Ms", title: "If Cleaning Was a Timed Sport. Part 2 🧹", likes: "6.1M", comments: "198K", author: "@DanielLaBelle" },
  { id: "3", videoId: "Kq4O7W5EQ7Y", title: "🐞 Ladybug Squishy DIY with Nano Tape", likes: "5.8M", comments: "176K", author: "@JoyBamm" },
  { id: "4", videoId: "ufvttxs9vEo", title: "Monica Toy - If you can't imitate, just stay home! 🎭", likes: "5.3M", comments: "154K", author: "@MonicaToy" },
  { id: "5", videoId: "Nus7MfF2ytw", title: "Power Tools Racing Is INTENSE!! ⚡🏎️", likes: "5.1M", comments: "143K", author: "@HowRidiculous" },
  { id: "6", videoId: "OE1mRsNz85k", title: "أول تجربة لي بالتصوير 📸", likes: "4.9M", comments: "131K", author: "@GK8VLOGS" },
  { id: "7", videoId: "xLezgUBTFg4", title: "World's Best Prank Gone Wrong! 😱", likes: "4.4M", comments: "119K", author: "@CollinsKeyShorts" },
  // 10 SHORTS VIRALES ADICIONALES - IDs verificados
  { id: "11", videoId: "R1Ehb3JA-cM", title: "How Zach King Gets Away With Doing Graffiti 🎨✨", likes: "31M", comments: "420K", author: "@dollarbill" },
  { id: "12", videoId: "4MjzAPYi2CM", title: "😱OMG😱 BEST TEACHER", likes: "35M", comments: "389K", author: "@dednahype" },
  { id: "13", videoId: "QV6iOzP_OXY", title: "EATING SPONGE PRANK ON GIRLFRIEND 🧽😂 #Shorts", likes: "4.1M", comments: "95K", author: "@TopperGuild" },
  { id: "14", videoId: "CxYkQzP8sew", title: "Turning Statues Into Food!! (Delicious) 🍫", likes: "3.9M", comments: "88K", author: "@BrandonB" },
  { id: "15", videoId: "xXzanRLIb_c", title: "HAND IN BUCKET PRANK!! 🤣 #Shorts", likes: "3.7M", comments: "81K", author: "@JuliusDein" },
  { id: "18", videoId: "cm8x4uR1bck", title: "Impossible balance 🤯 #shorts", likes: "3.1M", comments: "67K", author: "@XavierMortimer" },
  { id: "19", videoId: "hfPdEE4kpYM", title: "Monster goes to the nail salon 🧟‍♀️😂", likes: "2.9M", comments: "63K", author: "@Yoeslan" },
  { id: "20", videoId: "mep818UaYz0", title: "FUNNY DIY FOOT SOAP 🧼🦶😂 #SHORTS", likes: "2.7M", comments: "58K", author: "@5MinuteCraftsFamily" },
];

// YT player states
const YT_PLAYING = 1;
const YT_PAUSED  = 2;

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad|od)/.test(navigator.userAgent);
}

export default function YouTubeShortsViewer({ videos = DEFAULT_VIDEOS }: { videos?: VideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0]));

  // Only shown when the video truly failed to autoplay (iOS blocked it)
  const [showOverlay, setShowOverlay] = useState(false);

  const scrollRef       = useRef<HTMLDivElement>(null);
  const activeIndexRef  = useRef(0);
  const isMutedRef      = useRef(true);
  const onIOSRef        = useRef(false);
  // Timer that shows the overlay if no "playing" state arrives in time
  const playCheckTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
    onIOSRef.current = isIOS();
  }, []);

  // ─── postMessage helper ───────────────────────────────────────────────────────
  const sendCommand = useCallback((index: number, command: string, args: unknown[] = []) => {
    const iframe = document.getElementById(`yt-player-${index}`) as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args }),
        "*"
      );
    }
  }, []);

  // ─── listen to YT player state via postMessage ────────────────────────────────
  // When the active video fires "playing" (state 1), the overlay is not needed.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        // YouTube sends { event: "infoDelivery", info: { playerState: N } }
        if (msg?.event !== "infoDelivery") return;
        const state = msg?.info?.playerState;
        if (state === YT_PLAYING || state === YT_PAUSED) {
          // Only care about the active video
          // Find which iframe fired by matching the source origin — we can't get
          // the index from the message, so we check: if the active video just
          // started playing, cancel the overlay.
          if (state === YT_PLAYING) {
            if (playCheckTimer.current) {
              clearTimeout(playCheckTimer.current);
              playCheckTimer.current = null;
            }
            setShowOverlay(false);
          }
        }
      } catch {
        // ignore non-JSON
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // ─── preload window ───────────────────────────────────────────────────────────
  const ensureVideosLoaded = useCallback((centerIndex: number) => {
    setLoadedVideos(prev => {
      const next = new Set(prev);
      for (let i = centerIndex; i <= Math.min(centerIndex + 2, videos.length - 1); i++) next.add(i);
      if (centerIndex > 0) next.add(centerIndex - 1);
      return next;
    });
  }, [videos.length]);

  // ─── try to play + start the "did it work?" timer ────────────────────────────
  const tryPlay = useCallback((index: number) => {
    sendCommand(index, "playVideo");
    if (!isMutedRef.current) {
      sendCommand(index, "unMute");
      sendCommand(index, "setVolume", [100]);
    }

    // Only arm the fallback timer on iOS where autoplay may be blocked
    if (!onIOSRef.current) return;

    if (playCheckTimer.current) clearTimeout(playCheckTimer.current);
    setShowOverlay(false); // reset while we wait

    playCheckTimer.current = setTimeout(() => {
      // If we're here the YT player never reported "playing" → show overlay
      setShowOverlay(true);
      playCheckTimer.current = null;
    }, 800);
  }, [sendCommand]);

  // ─── scroll handler ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isMounted) return;

    const onScroll = () => {
      const h = el.clientHeight;
      if (h === 0) return;
      const idx = Math.round(el.scrollTop / h);
      if (idx === activeIndexRef.current) return;

      const prev = activeIndexRef.current;
      activeIndexRef.current = idx;

      sendCommand(prev, "pauseVideo");
      setActiveIndex(idx);
      ensureVideosLoaded(idx);
      tryPlay(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMounted, sendCommand, ensureVideosLoaded, tryPlay]);

  // ─── iOS overlay tap ──────────────────────────────────────────────────────────
  const handleOverlayTap = useCallback(() => {
    const index = activeIndexRef.current;
    const iframe = document.getElementById(`yt-player-${index}`) as HTMLIFrameElement;
    if (iframe) {
      iframe.focus();
      setTimeout(() => {
        sendCommand(index, "playVideo");
        if (!isMutedRef.current) {
          sendCommand(index, "unMute");
          sendCommand(index, "setVolume", [100]);
        }
        iframe.blur();
        window.focus();
      }, 30);
    }
    setShowOverlay(false);
  }, [sendCommand]);

  // ─── unmute ───────────────────────────────────────────────────────────────────
  const unmuteAll = useCallback(() => {
    if (!isMutedRef.current) return;
    isMutedRef.current = false;
    setIsMuted(false);
    sendCommand(activeIndexRef.current, "unMute");
    sendCommand(activeIndexRef.current, "setVolume", [100]);
  }, [sendCommand]);

  useEffect(() => {
    const monitor = setInterval(() => {
      if (document.activeElement?.tagName === "IFRAME" && isMutedRef.current) {
        unmuteAll();
        (document.activeElement as HTMLElement).blur();
        window.focus();
      }
    }, 500);
    return () => clearInterval(monitor);
  }, [unmuteAll]);

  // ─── initial preload ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => ensureVideosLoaded(0), 500);
    return () => clearTimeout(t);
  }, [isMounted, ensureVideosLoaded]);

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (playCheckTimer.current) clearTimeout(playCheckTimer.current);
  }, []);

  if (!isMounted) return <div style={{ background: "#000", height: "100svh" }} />;

  return (
    <div style={{ position: "relative", width: "100%", height: "100svh", background: "#000", overflow: "hidden" }}>
      <style>{`
        .yt-scroll::-webkit-scrollbar { display: none; }

        .top-left-controls {
          position: absolute; top: 20px; left: 20px; z-index: 100;
          display: flex; align-items: center; gap: 12px;
        }

        .control-btn {
          background: rgba(0,0,0,0.5); color: white;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 30px; cursor: pointer; font-weight: bold;
          backdrop-filter: blur(8px); transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center;
        }

        .mute-btn { padding: 0 20px; height: 44px; font-size: 13px; }

        .video-container {
          flex-shrink: 0; width: 100%; height: 100svh;
          scroll-snap-align: start; scroll-snap-stop: always;
          position: relative; background: #000;
        }

        .tiktok-ui {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 10;
          display: flex; flex-direction: column;
          justify-content: center; align-items: flex-end;
          padding-right: 12px;
        }

        .icons-column {
          pointer-events: auto;
          display: flex; flex-direction: column;
          align-items: center; gap: 20px;
        }

        .ui-item {
          display: flex; flex-direction: column;
          align-items: center; color: white;
          font-family: sans-serif; font-size: 12px;
        }

        .avatar-box {
          width: 50px; height: 50px; border-radius: 50%;
          border: 2px solid white; background: #333;
          overflow: hidden; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }

        .avatar-box img { width: 100%; height: 100%; object-fit: cover; }

        .big-icon {
          font-size: 34px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
          line-height: 1;
        }

        .video-info {
          position: absolute; bottom: 85px; left: 15px;
          color: white; pointer-events: none;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
          max-width: 75%; z-index: 20;
        }

        .ad-wrapper {
          position: absolute; bottom: 0px; left: 50%;
          transform: translateX(-50%); z-index: 30;
          width: 320px; min-height: 50px;
          pointer-events: auto;
        }

        /* Shown only when iOS blocked autoplay */
        .ios-play-overlay {
          position: absolute; inset: 0; z-index: 9;
          display: flex; align-items: center; justify-content: center;
          background: transparent; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .ios-play-hint {
          background: rgba(0,0,0,0.5);
          border-radius: 50%; width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          animation: ios-pulse 1s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes ios-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.1); opacity: 1;    }
        }

        .video-offscreen { content-visibility: hidden; }
      `}</style>

      <div className="top-left-controls">
        {isMuted && (
          <button className="control-btn mute-btn" onClick={unmuteAll}>
            🔊 Activar Sonido
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="yt-scroll"
        style={{
          width: "100%", height: "100%", overflowY: "scroll",
          scrollSnapType: "y mandatory", display: "flex", flexDirection: "column",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {videos.map((video, index) => {
          const isFar    = Math.abs(index - activeIndex) > 5;
          const isLoaded = loadedVideos.has(index);
          // Overlay only on the active video and only when iOS truly blocked play
          const isActive       = index === activeIndex;
          const showThisOverlay = isActive && showOverlay;

          return (
            <div key={video.id} className={`video-container${isFar ? " video-offscreen" : ""}`}>
              {isLoaded ? (
                <>
                  <iframe
                    id={`yt-player-${index}`}
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}?enablejsapi=1&autoplay=1&mute=1&controls=1&rel=0&playsinline=1&loop=1&playlist=${video.videoId}`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  {showThisOverlay && (
                    <div className="ios-play-overlay" onClick={handleOverlayTap}>
                      <div className="ios-play-hint">▶️</div>
                    </div>
                  )}

                  <div className="tiktok-ui">
                    <div className="icons-column">
                      <div className="ui-item">
                        <div className="avatar-box">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`}
                            alt="avatar"
                          />
                        </div>
                      </div>
                      <div className="ui-item">
                        <span className="big-icon">🤍</span>
                        <b style={{ marginTop: "2px" }}>{video.likes}</b>
                      </div>
                      <div className="ui-item">
                        <span className="big-icon">💬</span>
                        <b style={{ marginTop: "2px" }}>{video.comments}</b>
                      </div>
                      <div className="ui-item">
                        <span className="big-icon" style={{ fontSize: "30px" }}>🚀</span>
                        <b style={{ marginTop: "2px" }}>Share</b>
                      </div>
                    </div>
                  </div>

                  <div className="video-info">
                    <b style={{ fontSize: "17px" }}>{video.author}</b>
                    <p style={{ margin: "6px 0 0", fontSize: "15px", lineHeight: "1.4" }}>{video.title}</p>
                  </div>

                  <div className="ad-wrapper">
                    <AdBanner key={`ad-${video.id}`} dimentions={"320x50"} />
                  </div>
                </>
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#000" }} />
              )}
            </div>
          );
        })}

       
      </div>
    </div>
  );
}