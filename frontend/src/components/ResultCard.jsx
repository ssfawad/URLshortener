import { useState } from 'react'

export default function ResultCard({ code, originalUrl }) {
  const [copied, setCopied] = useState(false)

  // In prod, VITE_API_BASE is the Cloud Run URL (injected at build time by GitHub Actions)
  // In dev, falls back to same origin (Vite proxy handles /r/* → localhost:8080)
  const apiBase = import.meta.env.VITE_API_BASE || window.location.origin
  const shortUrl = `${apiBase}/r/${code}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — select the link text so user can copy manually
      window.getSelection()?.selectAllChildren(document.querySelector('a[href="' + shortUrl + '"]'))
    }
  }

  return (
    <div className="w-full mt-6 p-5 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
      <p className="text-sm text-white/60 mb-2">Your short link</p>
      <div className="flex items-center gap-3">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-indigo-300 font-mono text-sm break-all hover:text-indigo-200 transition-colors"
        >
          {shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className={`shrink-0 px-3 py-1.5 text-sm font-medium border rounded-lg transition-all duration-200
            ${copied
              ? 'bg-green-500/80 border-green-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-3 text-xs text-white/40 truncate">
        Original: {originalUrl}
      </p>
    </div>
  )
}
