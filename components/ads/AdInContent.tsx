'use client'
import { useEffect, useRef } from 'react'

export default function AdInContent() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || ref.current.dataset.loaded) return
    ref.current.dataset.loaded = '1'
    const s = document.createElement('script')
    s.src = 'https://pl29155449.profitablecpmratenetwork.com/b5ce4766f871095b97a8d3beb351ba02/invoke.js'
    s.async = true
    s.setAttribute('data-cfasync', 'false')
    ref.current.appendChild(s)
  }, [])
  return (
    <div className="w-full my-4">
      <div id="container-b5ce4766f871095b97a8d3beb351ba02" ref={ref} />
    </div>
  )
}
