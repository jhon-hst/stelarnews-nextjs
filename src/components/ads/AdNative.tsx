"use client"

import { useEffect, useRef } from 'react'

const AD_KEY = 'a2ffdd92e21951d609d0093f258088ad'

const adHtml = `
<!DOCTYPE html>
<html>
  <head>
    <script async="async" data-cfasync="false" src="https://pl28932108.effectivegatecpm.com/${AD_KEY}/invoke.js"></script>
    <style>* { margin: 0; padding: 0; box-sizing: border-box; }</style>
  </head>
  <body style="margin:0;padding:0;background:transparent;">
    <div id="container-${AD_KEY}"></div>
    <script>
      function sendHeight() {
        const h = document.body.scrollHeight;
        window.parent.postMessage({ type: 'ad-resize', height: h }, '*');
      }
      // Poll until ad content loads and stabilizes
      let last = 0;
      const interval = setInterval(function() {
        const h = document.body.scrollHeight;
        if (h !== last && h > 0) {
          last = h;
          sendHeight();
        }
      }, 200);
      // Stop polling after 10s
      setTimeout(function() { clearInterval(interval); }, 10000);
    </script>
  </body>
</html>
`

export default function AdNative() {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return

        doc.open()
        doc.write(adHtml)
        doc.close()

        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'ad-resize' && e.data.height > 0) {
                iframe.style.height = `${e.data.height}px`
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    return (
        <div ref={wrapperRef} className="mx-2 my-5 flex justify-center items-center">
            <iframe
                ref={iframeRef}
                style={{ border: 'none', width: '100%', height: '0px', transition: 'height 0.2s ease' }}
                scrolling="no"
            />
        </div>
    )
}