// components/history/SwipeIndicator.tsx
"use client";

import { useEffect, useState } from "react";

export default function SwipeIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        pointer-events-none
        mx-10
      "
    >
      <div
        className="
          bg-black/50
          px-6 py-4
          rounded-2xl
          backdrop-blur-sm
        "
      >
        <p
          className="
            text-yellow-400
            text-center
            uppercase
            font-extrabold
            tracking-wider
            text-lg sm:text-xl
          "
        >
          Desliza hacia arriba para leer
        </p>
      </div>
    </div>
  );
}