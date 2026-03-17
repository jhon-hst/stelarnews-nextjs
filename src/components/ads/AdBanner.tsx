"use client";

import Script from "next/script";

export default function AdBanner() {
  return (
    <div className="my-4 py-4 border-y border-slate-50 text-center">
      <Script id="adsterra-config" strategy="afterInteractive">
        {`
          atOptions = {
            'key' : '7412f5bc9c86d823cd5ae885b48b686b',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `}
      </Script>

      <Script
        src="https://www.highperformanceformat.com/7412f5bc9c86d823cd5ae885b48b686b/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}