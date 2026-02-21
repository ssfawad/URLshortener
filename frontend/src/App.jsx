import { useState } from 'react'
import ShortenForm from './components/ShortenForm'
import ResultCard from './components/ResultCard'

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-10" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4 text-3xl shadow-lg">
            🔗
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">URL Shortener</h1>
          <p className="text-white/60">Paste a long URL and get a short, shareable link</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
          <ShortenForm onResult={setResult} onSubmit={() => setResult(null)} />
          {result && (
            <ResultCard code={result.code} originalUrl={result.originalUrl} />
          )}
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Built on GCP · Cloud Run · Cloud SQL · Cloud Storage · Terraform ·{' '}
          <a
            href="https://github.com/ssfawad/URLshortener"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 underline underline-offset-2 transition-colors"
          >
            View source
          </a>
        </p>
      </div>
    </div>
  )
}
