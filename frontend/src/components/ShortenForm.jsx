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
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  )
}
