import { useState } from 'react'

export default function ResultCard({ code, originalUrl }) {
  const [copied, setCopied] = useState(false)

  // In prod, VITE_API_BASE is the Cloud Run URL (injected at build time by GitHub Actions)
  // In dev, falls back to same origin (Vite proxy handles /r/* → localhost:8080)
  const apiBase = import.meta.env.VITE_API_BASE || window.location.origin
  const shortUrl = `${apiBase}/r/${code}`

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full mt-6 p-5 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-gray-500 mb-1">Short URL</p>
      <div className="flex items-center gap-3">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-blue-600 font-mono text-sm break-all hover:underline"
        >
          {shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 text-sm font-medium bg-white border border-gray-300
                     rounded-md hover:bg-gray-50 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-400 truncate">
        Original: {originalUrl}
      </p>
    </div>
  )
}
