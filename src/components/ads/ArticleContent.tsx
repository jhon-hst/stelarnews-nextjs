"use client"

import { useEffect, useRef } from "react"
import AdBanner from "@/components/ads/AdBanner"
import { createRoot, Root } from "react-dom/client"

export default function ArticleContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const roots = useRef<Root[]>([])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const placeholders = el.querySelectorAll('[data-ad-placeholder]')
    
    placeholders.forEach((placeholder, index) => {
      const root = createRoot(placeholder)
      roots.current.push(root)
      root.render(<AdBanner dimentions="dynamic" delay={1000 * (index + 1)} />)
    })

    return () => {
      roots.current.forEach(root => root.unmount())
      roots.current = []
    }
  }, [html])

  const processedHtml = html.replace(
    /<span class="text-\[10px\] text-slate-300 uppercase tracking-widest">Advertisement<\/span>/g,
    `<div data-ad-placeholder="true"></div>`
  )

  return (
    <div
      ref={ref}
      className="flex flex-col bg-white text-[#1a1a1a]"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}