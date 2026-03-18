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
  { id: "160x300", width: 160, height: 300, key: '6b3622cb929b38a21c09e582ea6becb7' },
  { id: "320x50",  width: 320, height: 50,  key: 'd86e32b9c9638d32cf822700ec819d06' },
  { id: "160x600", width: 160, height: 600, key: '869515bd1d5f50615fd4d02136403d32' },
  { id: "300x250", width: 300, height: 250, key: '869515bd1d5f50615fd4d02136403d32' },
]

const bannersByAreaDesc = [...bannersDimentions].sort(
  (a, b) => (b.width * b.height) - (a.width * a.height)
)

function getBestFitBanner(availableWidth: number): BannersDimentionsType | null {
  // Solo comparamos ancho, ya que el alto del viewport siempre es suficiente
  return bannersByAreaDesc.find((b) => b.width <= availableWidth) ?? null
}

function injectBanner(el: HTMLDivElement, selected: BannersDimentionsType) {
  // Limpiar antes de inyectar
  el.innerHTML = ''

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
}

export default function AdBanner({ dimentions }: { dimentions: typeof bannersDimentions[number]['id'] | 'dynamic' }) {
  const banner = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = banner.current
    if (!el) return

    if (dimentions !== 'dynamic') {
      if (el.firstChild) return
      const selected = bannersDimentions.find(({ id }) => id === dimentions)
      console.log(selected)
      if (selected) injectBanner(el, selected)
      return
    }

    // --- Lógica dynamic ---
    let lastInjectedId: string | null = null

    const inject = () => {
      // Usamos el ancho del contenedor wrapper o el viewport
      const availableWidth = el.parentElement?.clientWidth || window.innerWidth
      const selected = getBestFitBanner(availableWidth)

      if (!selected) return
      // Solo re-inyectar si cambió el banner
      if (selected.id === lastInjectedId) return

      lastInjectedId = selected.id
      injectBanner(el, selected)
    }

    inject()

    // Re-evaluar si cambia el tamaño de la ventana
    window.addEventListener('resize', inject)

    return () => {
      window.removeEventListener('resize', inject)
      el.innerHTML = ''
    }
  }, [dimentions])

  return (
    <div
      className="mx-2 my-5 flex justify-center items-center text-white text-center"
      ref={banner}
    />
  )
}