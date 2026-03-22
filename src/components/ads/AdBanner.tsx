"use client"

import { useEffect, useRef } from 'react'

type BannersDimentionsType = {
  id: string;
  height: number;
  width: number;
  key: string;
}

const bannersDimentions: BannersDimentionsType[] = [
  { id: "728x90",  width: 728, height: 90,  key: '7412f5bc9c86d823cd5ae885b48b686b' },
  { id: "468x60",  width: 468, height: 60,  key: '2aed314c977f704204791377c85a1a8c' },
  { id: "320x50",  width: 320, height: 50,  key: 'd86e32b9c9638d32cf822700ec819d06' },
  { id: "300x250", width: 300, height: 250, key: 'fdf7cf6b9d059e107f437dace972672d' },
  { id: "160x300", width: 160, height: 300, key: '6b3622cb929b38a21c09e582ea6becb7' },
  { id: "160x600", width: 160, height: 600, key: '869515bd1d5f50615fd4d02136403d32' },
]

// Ordenados de mayor a menor área para la lógica dynamic
const bannersByAreaDesc = [...bannersDimentions].sort(
  (a, b) => b.width - a.width  // solo ancho, sin altura
)

function getBestFitBanner(containerWidth: number): BannersDimentionsType | null {
  return bannersByAreaDesc.find(
    (b) => b.width <= containerWidth
  ) ?? null
}

export default function AdBanner({ dimentions, delay = 0 }: { dimentions: typeof bannersDimentions[number]['id'] | 'dynamic',   delay?: number  }) {
  const banner = useRef<HTMLDivElement>(null)


  useEffect(() => {
    window.open(
      'https://omg10.com/4/10763249',
      '_blank',
      'noopener,noreferrer'
    )
  }, [])
  
  useEffect(() => {
   

    const timer = setTimeout(() => {
      const el = banner.current
      if (!el) return
  
      // Limpiar siempre antes de inyectar
      el.innerHTML = ''
  
      let selected: BannersDimentionsType | undefined
  
      if (dimentions === 'dynamic') {
        const availableWidth = el.parentElement?.clientWidth ?? window.innerWidth
        selected = getBestFitBanner(availableWidth) ?? undefined
      } else {
        selected = bannersDimentions.find(({ id }) => id === dimentions)
      }
  
      if (!selected) return
  
      const atOptions = {
        ...selected,
        format: 'iframe',
        params: {}
      }
  
      const uniqueVar = `atOptions_${Math.random().toString(36).slice(2)}`
  
      const conf = document.createElement('script')
      conf.innerHTML = `var ${uniqueVar} = ${JSON.stringify(atOptions)}; var atOptions = ${uniqueVar};`
  
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.highperformanceformat.com/${selected.key}/invoke.js`
  
      el.append(conf)
      el.append(script)
  
  
    }, delay)

    return () => {
      clearTimeout(timer)
      if (banner.current) banner.current.innerHTML = ''
    }

  }, [dimentions])
  
  return (
    <div
      className="mx-2 my-5 flex justify-center items-center text-white text-center"
      ref={banner}
    />
  )
}