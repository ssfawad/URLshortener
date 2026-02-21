import { useState } from 'react'
import ShortenForm from './components/ShortenForm'
import ResultCard from './components/ResultCard'

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">URL Shortener</h1>
          <p className="text-gray-500">Paste a long URL and get a short, shareable link</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <ShortenForm onResult={setResult} />
          {result && (
            <ResultCard code={result.code} originalUrl={result.originalUrl} />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Built on GCP · Cloud Run · Cloud SQL · Terraform
        </p>
      </div>
    </div>
  )
}
