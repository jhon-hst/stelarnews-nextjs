"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const VIDEOS = [
  {
    id: "M7lc1UVf-VE",
    title: "YouTube Shorts Demo #1",
    author: "@youtube",
    likes: "1.2M",
  },
  {
    id: "9bZkp7q19f0",
    title: "PSY – GANGNAM STYLE",
    author: "@officialpsy",
    likes: "23M",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    author: "@rickastley",
    likes: "4.5M",
  },
  {
    id: "JGwWNGJdvx8",
    title: "Shape of You",
    author: "@edsheeran",
    likes: "8.1M",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Despacito",
    author: "@luisfonsi",
    likes: "12M",
  },
];

export default function ShortsPlayer() {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"up" | "down" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (direction: "up" | "down") => {
      if (isAnimating) return;
      const next =
        direction === "up"
          ? Math.min(current + 1, VIDEOS.length - 1)
          : Math.max(current - 1, 0);
      if (next === current) return;
      setAnimDir(direction);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(next);
        setAnimDir(null);
        setIsAnimating(false);
      }, 320);
    },
    [current, isAnimating]
  );

  // Wheel navigation
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (wheelTimeout.current) return;
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 600);
      if (e.deltaY > 30) goTo("up");
      else if (e.deltaY < -30) goTo("down");
    },
    [goTo]
  );

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    touchStartY.current = null;
    touchStartX.current = null;
    if (Math.abs(dy) < 50 || dx > Math.abs(dy)) return;
    if (dy > 0) goTo("up");
    else goTo("down");
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo("up");
      if (e.key === "ArrowUp") goTo("down");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo]);

  const video = VIDEOS[current];
  const iframeSrc = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1${muted ? "&mute=1" : ""}`;

  // Slide animation classes
  const slideClass =
    animDir === "up"
      ? "animate-slide-up"
      : animDir === "down"
      ? "animate-slide-down"
      : "";

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Desktop background blur */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center blur-2xl opacity-20 scale-110"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${video.id}/maxresdefault.jpg)`,
        }}
      />
      <div className="absolute inset-0 hidden md:block bg-black/60" />

      {/*
        Player container:
        - Mobile: full screen
        - Desktop: centered, 9:16, max-h-screen
      */}
      <div className="relative w-full h-full md:h-[92vh] md:max-h-[900px] md:w-auto md:aspect-[9/16] md:rounded-2xl overflow-hidden shadow-2xl">

        {/* Iframe */}
        <div className={`absolute inset-0 ${slideClass}`} key={current}>
          <iframe
            src={iframeSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Top gradient */}
        <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />

        {/* Bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/80 to-transparent z-10" />

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 pt-5 pb-2">
          <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Shorts
          </span>
          {/* Mute toggle */}
          <button
            onClick={() => setMuted((m) => !m)}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017 19.73l2 2L20.27 21 3 3.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Right action bar */}
        <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
              {video.author[1].toUpperCase()}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </div>
          </div>

          {/* Like */}
          <button
            onClick={() => setLiked((l) => ({ ...l, [current]: !l[current] }))}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${liked[current] ? "bg-red-500/20" : "bg-white/10 backdrop-blur-md"}`}>
              <svg viewBox="0 0 24 24" fill={liked[current] ? "#ef4444" : "white"} className="w-6 h-6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-white text-xs font-medium">{video.likes}</span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
              </svg>
            </div>
            <span className="text-white text-xs font-medium">234</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
              </svg>
            </div>
            <span className="text-white text-xs font-medium">Compartir</span>
          </button>

          {/* More */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-6 left-4 right-16 z-20">
          <p className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
            {video.author}
          </p>
          <p className="text-white/80 text-sm leading-tight line-clamp-2">{video.title}</p>

          {/* Music bar */}
          <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white/70 text-xs whitespace-nowrap animate-marquee">
                {video.title} · {video.author} · YouTube Shorts
              </p>
            </div>
          </div>
        </div>

        {/* Navigation arrows — desktop only */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-[-68px] z-30 flex-col items-center gap-2">
          <button
            onClick={() => goTo("down")}
            disabled={current === 0}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all rotate-180"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 14l5-5 5 5z"/></svg>
          </button>
          <button
            onClick={() => goTo("up")}
            disabled={current === VIDEOS.length - 1}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 14l5-5 5 5z"/></svg>
          </button>
        </div>

        {/* Progress dots */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-1.5">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i > current) goTo("up");
                else if (i < current) goTo("down");
              }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-1.5 h-6 bg-white" : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Hint on mobile */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 md:hidden pointer-events-none">
        <p className="text-white/40 text-xs tracking-wider">desliza para navegar</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&display=swap');

        @keyframes slideUpIn {
          from { transform: translateY(100%); opacity: 0.4; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes slideDownIn {
          from { transform: translateY(-100%); opacity: 0.4; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-slide-up  { animation: slideUpIn  0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
        .animate-slide-down { animation: slideDownIn 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
        .animate-marquee   { animation: marquee 8s linear infinite; display: inline-block; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}