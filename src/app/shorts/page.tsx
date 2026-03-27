"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface VideoItem {
  id: string;
  videoId: string;
  title?: string;
}

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: "1", videoId: "KljXfBCU18w", title: "Video 1" },
  { id: "2", videoId: "nS9etPTLFSM", title: "Video 2" },
  { id: "3", videoId: "iJMjcBz1tIo", title: "Video 3" },
  { id: "4", videoId: "THFAF3VN9GQ", title: "Video 4" },
  { id: "5", videoId: "nCh8VmeYeWk", title: "Video 5" },
  { id: "6", videoId: "KljXfBCU18w", title: "Video 1" },
  { id: "7", videoId: "nS9etPTLFSM", title: "Video 2" },
  { id: "8", videoId: "iJMjcBz1tIo", title: "Video 3" },
  { id: "9", videoId: "THFAF3VN9GQ", title: "Video 4" },
  { id: "10", videoId: "nCh8VmeYeWk", title: "Video 5" },
  { id: "11", videoId: "KljXfBCU18w", title: "Video 1" },
  { id: "12", videoId: "nS9etPTLFSM", title: "Video 2" },
  { id: "13", videoId: "iJMjcBz1tIo", title: "Video 3" },
  { id: "14", videoId: "THFAF3VN9GQ", title: "Video 4" },
  { id: "15", videoId: "nCh8VmeYeWk", title: "Video 5" },
  { id: "16", videoId: "KljXfBCU18w", title: "Video 1" },
  { id: "17", videoId: "nS9etPTLFSM", title: "Video 2" },
  { id: "18", videoId: "iJMjcBz1tIo", title: "Video 3" },
  { id: "19", videoId: "THFAF3VN9GQ", title: "Video 4" },
  { id: "20", videoId: "nCh8VmeYeWk", title: "Video 5" },
  { id: "21", videoId: "KljXfBCU18w", title: "Video 1" },
  { id: "22", videoId: "nS9etPTLFSM", title: "Video 2" },
  { id: "23", videoId: "iJMjcBz1tIo", title: "Video 3" },
  { id: "24", videoId: "THFAF3VN9GQ", title: "Video 4" },
  { id: "25", videoId: "nCh8VmeYeWk", title: "Video 5" },
  { id: "26", videoId: "KljXfBCU18w", title: "Video 1" },
  { id: "27", videoId: "nS9etPTLFSM", title: "Video 2" },
  { id: "28", videoId: "iJMjcBz1tIo", title: "Video 3" },
  { id: "29", videoId: "THFAF3VN9GQ", title: "Video 4" },
  { id: "30", videoId: "nCh8VmeYeWk", title: "Video 5" },
];

export default function YouTubeShortsViewer({ videos = DEFAULT_VIDEOS }: { videos?: VideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0])); // Solo carga el primero
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Detector de clic (Tu truco favorito que funciona)
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

  // NUEVA FUNCIÓN: Carga inteligente de videos cercanos
  const ensureVideosLoaded = useCallback((centerIndex: number) => {
    setLoadedVideos(prev => {
      const newLoaded = new Set(prev);
      // Carga el video actual y los 2 siguientes (para precarga suave)
      for (let i = centerIndex; i <= Math.min(centerIndex + 2, videos.length - 1); i++) {
        newLoaded.add(i);
      }
      // También el anterior por si hace scroll hacia atrás
      if (centerIndex > 0) {
        newLoaded.add(centerIndex - 1);
      }
      return newLoaded;
    });
  }, [videos.length]);

  // Scroll Handler MEJORADO
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
        if (!isMuted) {
          sendCommand(idx, "unMute");
          sendCommand(idx, "setVolume", [100]);
        }
        
        // OPTIMIZACIÓN: Carga los videos cercanos cuando cambias
        ensureVideosLoaded(idx);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeIndex, isMounted, isMuted, sendCommand, ensureVideosLoaded]);

  // NUEVA OPTIMIZACIÓN: Precarga inicial progresiva (sin bloquear)
  useEffect(() => {
    if (!isMounted) return;
    
    // Carga gradual de los primeros videos (no todos a la vez)
    const timer = setTimeout(() => {
      ensureVideosLoaded(0);
    }, 500); // Espera medio segundo después del mount
    
    return () => clearTimeout(timer);
  }, [isMounted, ensureVideosLoaded]);

  if (!isMounted) return <div style={{ background: "#000", height: "100svh" }} />;

  return (
    <div style={{ position: "relative", width: "100%", height: "100svh", background: "#000", overflow: "hidden" }}>
      <style>{`
        .yt-scroll::-webkit-scrollbar { display: none; }
        .mute-btn {
          position: absolute; top: 20px; left: 20px; z-index: 100;
          background: rgba(0, 0, 0, 0.6); color: white; border: 1px solid rgba(255,255,255,0.2);
          padding: 10px 20px; border-radius: 30px; cursor: pointer;
          font-weight: bold; backdrop-filter: blur(8px); transition: all 0.3s ease;
        }
        
        .video-container {
          flex-shrink: 0; 
          width: 100%; 
          height: 100svh;
          scroll-snap-align: start; 
          scroll-snap-stop: always; 
          position: relative; 
          background: #000;
        }

        /* Placeholder para videos no cargados */
        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }

        .video-offscreen {
          content-visibility: hidden; /* Cambiado de hidden a auto para mejor performance */
        }
      `}</style>

      {isMuted && (
        <button className="mute-btn" onClick={unmuteAll}>
          🔊 Activar Sonido
        </button>
      )}

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
            <div
              key={video.id}
              className={`video-container ${isFar ? "video-offscreen" : ""}`}
            >
              {isLoaded ? (
                <iframe
                  id={`yt-player-${index}`}
                  src={`https://www.youtube-nocookie.com/embed/${video.videoId}?enablejsapi=1&autoplay=${index === 0 ? 1 : 0}&mute=1&controls=1&rel=0&playsinline=1&loop=1&playlist=${video.videoId}`}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                />
              ) : (
                <div className="video-placeholder">
                  {/* Placeholder silencioso - se carga cuando te acerques */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
