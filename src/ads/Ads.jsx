import { useEffect, useRef } from 'react'

function loadAd(container, key, width, height) {
  if (!container) return
  container.innerHTML = ''
  const config = document.createElement('script')
  config.type = 'text/javascript'
  config.text = `atOptions = { 'key' : '${key}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`
  const invoke = document.createElement('script')
  invoke.type = 'text/javascript'
  invoke.src = `https://www.highrevenueformat.com/${key}/invoke.js`
  container.appendChild(config)
  container.appendChild(invoke)
}

export function AdBanner320() {
  const ref = useRef(null)
  useEffect(() => { loadAd(ref.current, 'c1fc88310756d628ee077ceb2ca5caed', 320, 50) }, [])
  return <div className="ad-slot ad-320" aria-label="Advertisement"><div ref={ref}/></div>
}
export function AdBanner300() {
  const ref = useRef(null)
  useEffect(() => { loadAd(ref.current, '231d1c604e838bd3f6a3a5ce3c9e4eb6', 300, 250) }, [])
  return <div className="ad-slot ad-300" aria-label="Advertisement"><div ref={ref}/></div>
}
