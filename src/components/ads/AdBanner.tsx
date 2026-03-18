"use client"

import { useEffect, useRef } from 'react'

export default function AdBanner() {
    const banner = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = banner.current
        if (!el || el.firstChild) return

        const atOptions = {
            key: '7412f5bc9c86d823cd5ae885b48b686b',
            format: 'iframe',
            height: 90,
            width: 728,
            params: {}
        }

        // Unique variable name per instance to avoid global collision
        const uniqueVar = `atOptions_${Math.random().toString(36).slice(2)}`

        const conf = document.createElement('script')
        conf.innerHTML = `var ${uniqueVar} = ${JSON.stringify(atOptions)}; var atOptions = ${uniqueVar};`

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`

        el.append(conf)
        el.append(script)

        return () => {
            // Cleanup on unmount
            el.innerHTML = ''
        }
    }, [])

    return (
        <div
            className="mx-2 my-5 flex justify-center items-center text-white text-center"
            ref={banner}
        />
    )
}