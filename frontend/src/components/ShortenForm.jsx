import { useState } from 'react'

export default function ShortenForm({ onResult, onSubmit }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.()
    setError('')
    setLoading(true)

    try {
      const apiBase = import.meta.env.VITE_API_BASE || ''
      const res = await fetch(`${apiBase}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      onResult(data)
      setUrl('')
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/your/long/url"
          required
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     backdrop-blur-sm transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600
                     hover:from-indigo-600 hover:to-purple-700
                     disabled:opacity-60 disabled:cursor-not-allowed
                     text-white font-semibold rounded-xl transition-all duration-200
                     shadow-lg shadow-purple-900/50"
        >
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </form>
  )
}
