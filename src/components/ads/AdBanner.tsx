"use client";

import { useEffect, useRef } from "react";

export default function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const script1 = document.createElement("script");
    script1.innerHTML = `
      atOptions = {
        key: '7412f5bc9c86d823cd5ae885b48b686b',
        format: 'iframe',
        height: 90,
        width: 728,
        params: {}
      };
    `;

    const script2 = document.createElement("script");
    script2.src = "//www.highperformanceformat.com/7412f5bc9c86d823cd5ae885b48b686b/invoke.js";
    script2.async = true;

    adRef.current.innerHTML = "";
    adRef.current.appendChild(script1);
    adRef.current.appendChild(script2);
  }, []);

  return (
    <div className="my-4 py-4 border-y border-slate-50 text-center">
      <span className="text-[10px] text-slate-300 uppercase tracking-widest">
        Advertisement
      </span>

      <div ref={adRef} />
    </div>
  );
}