import { useState } from 'react'
import { Wand2, Loader2 } from 'lucide-react'

export default function PromptBox({ onGenerate }) {
  const [prompt, setPrompt] = useState(
    'Build a simple todo app with React and Tailwind.',
  )
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      await onGenerate(prompt)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <label
        htmlFor="prompt"
        className="block text-sm font-medium text-gray-700"
      >
        Describe your app
      </label>
      <textarea
        id="prompt"
        className="mt-2 w-full h-32 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="E.g., A landing page with a hero, features, and contact form."
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-3 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        aria-busy={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4" />
        )}
        Generate Code
      </button>
    </div>
  )
}
