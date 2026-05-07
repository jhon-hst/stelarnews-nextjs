// components/NextEpisodeButton.tsx
"use client";

import { ArrowRight } from "lucide-react";

interface Props {
  url: string;
  nextPageKey: string;
}

export default function NextEpisodeButton({
  url,
  nextPageKey,
}: Props) {
  return (
    <button
      onClick={() => {
        const newTab = window.open(url, "_blank");

        newTab?.focus();

        window.location.href = "https://www.profitablecpmratenetwork.com/adaqbm7zpk?key=62a996503c2f09182a5463638337e3a9";
      }}
      className="
        w-full flex items-center justify-center gap-4
        border-4 border-black
        bg-white text-black
        rounded-2xl
        py-6
        text-xl sm:text-2xl
        font-extrabold
        transition
        hover:bg-gray-100
      "
    >
      <span>Leer Episodio {nextPageKey}</span>

      <span className="flex items-center justify-center bg-yellow-400 rounded-full p-3">
        <ArrowRight className="w-6 h-6 text-black" />
      </span>
    </button>
  );
}