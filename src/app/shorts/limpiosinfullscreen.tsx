 
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

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: "1", videoId: "KljXfBCU18w", title: "Cocinando en casa 🍳", likes: "12.5K", comments: "124", author: "@chef_master" },
  { id: "2", videoId: "nS9etPTLFSM", title: "Increíble atardecer 🌅", likes: "8.2K", comments: "45", author: "@nature_vibe" },
  { id: "3", videoId: "iJMjcBz1tIo", title: "Setup Gamer 2024 💻", likes: "45K", comments: "890", author: "@tech_reviews" },
  { id: "4", videoId: "THFAF3VN9GQ", title: "Trucos de Next.js 🚀", likes: "3.1K", comments: "12", author: "@react_dev" },
  { id: "5", videoId: "nCh8VmeYeWk", title: "Gatitos divertidos 🐱", likes: "105K", comments: "2.3K", author: "@cat_lover" },
  { id: "6", videoId: "KljXfBCU18w", title: "Rutina de mañana ☀️", likes: "5.6K", comments: "34", author: "@fitness_life" },
  { id: "7", videoId: "nS9etPTLFSM", title: "Viaje a Japón 🇯🇵", likes: "98K", comments: "1.1K", author: "@travel_pro" },
];

export default function YouTubeShortsViewer({ videos = DEFAULT_VIDEOS }: { videos?: VideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0]));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sendCommand = useCallback((index: number, command: string, args: unknown[] = []) => {
    const iframe = document.getElementById(`yt-player-${index}`) as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args }), "*");
    }
  }, []);

  const unmuteAll = useCallback(() => {
    if (!isMuted) return;
    setIsMuted(false);
    sendCommand(activeIndex, "unMute");
    sendCommand(activeIndex, "setVolume", [100]);
  }, [activeIndex, isMuted, sendCommand]);

  useEffect(() => {
    const monitorClick = setInterval(() => {
      if (document.activeElement?.tagName === "IFRAME" && isMuted) {
        unmuteAll();
        (document.activeElement as HTMLElement).blur();
        window.focus();
      }
    }, 500);
    return () => clearInterval(monitorClick);
  }, [isMuted, unmuteAll]);

  const ensureVideosLoaded = useCallback((centerIndex: number) => {
    setLoadedVideos(prev => {
      const newLoaded = new Set(prev);
      for (let i = centerIndex; i <= Math.min(centerIndex + 2, videos.length - 1); i++) {
        newLoaded.add(i);
      }
      if (centerIndex > 0) newLoaded.add(centerIndex - 1);
      return newLoaded;
    });
  }, [videos.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isMounted) return;
    const onScroll = () => {
      const h = el.clientHeight;
      if (h === 0) return;
      const idx = Math.round(el.scrollTop / h);
      if (idx !== activeIndex) {
        sendCommand(activeIndex, "pauseVideo");
        setActiveIndex(idx);
        sendCommand(idx, "playVideo");
        if (!isMuted) { sendCommand(idx, "unMute"); sendCommand(idx, "setVolume", [100]); }
        ensureVideosLoaded(idx);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeIndex, isMounted, isMuted, sendCommand, ensureVideosLoaded]);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => { ensureVideosLoaded(0); }, 500);
    return () => clearTimeout(timer);
  }, [isMounted, ensureVideosLoaded]);

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
          background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(255,255,255,0.2);
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
          color: white; pointer-events: none; text-shadow: 0 1px 4px rgba(0,0,0,0.8);
          max-width: 75%;
          z-index: 20;
        }

        .ad-wrapper {
          position: absolute; bottom: 10px; left: 50%;
          transform: translateX(-50%); z-index: 30;
          width: 320px; min-height: 50px;
          pointer-events: auto;
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
          WebkitOverflowScrolling: "touch"
        }}
      >
        {videos.map((video, index) => {
          const isFar = Math.abs(index - activeIndex) > 5;
          const isLoaded = loadedVideos.has(index);

          return (
            <div key={video.id} className={`video-container ${isFar ? "video-offscreen" : ""}`}>
              {isLoaded ? (
                <>
                  <iframe
                    id={`yt-player-${index}`}
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}?enablejsapi=1&autoplay=${index === 0 ? 1 : 0}&mute=1&controls=1&rel=0&playsinline=1&loop=1&playlist=${video.videoId}`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                
                  <div className="tiktok-ui">
                    <div className="icons-column">
                      <div className="ui-item">
                        <div className="avatar-box">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} alt="p" />
                        </div>
                      </div>

                      <div className="ui-item">
                        <span className="big-icon">🤍</span>
                        <b style={{marginTop: '2px'}}>{video.likes}</b>
                      </div>

                      <div className="ui-item">
                        <span className="big-icon">💬</span>
                        <b style={{marginTop: '2px'}}>{video.comments}</b>
                      </div>

                      <div className="ui-item">
                        <span className="big-icon" style={{fontSize: '30px'}}>🚀</span>
                        <b style={{marginTop: '2px'}}>Share</b>
                      </div>
                    </div>

                    <div className="video-info">
                      <b style={{ fontSize: '17px' }}>{video.author}</b>
                      <p style={{ margin: '6px 0 0', fontSize: '15px', lineHeight: '1.4' }}>{video.title}</p>
                    </div>
                  </div>

                  <div className="ad-wrapper">
                    <AdBanner key={`ad-${video.id}`} dimentions={"320x50"}/>
                  </div>
                </>
              ) : (
                <div className="video-placeholder" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
