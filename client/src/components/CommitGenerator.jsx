import { useState } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check } from 'lucide-react'

export default function CommitGenerator() {
  const [changes, setChanges] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!changes.trim()) return
    
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const data = await callApi('/generate-commit', { changes })
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-white">Generate Commit Message</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Paste your `git diff` output or describe your code changes, and AI will generate a clean commit message following standard conventions.
        </p>
        <textarea
          value={changes}
          onChange={(e) => setChanges(e.target.value)}
          placeholder="e.g. Added user authentication using JWT and bcrypt..."
          className="input-field min-h-[150px]"
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleGenerate} 
            disabled={loading || !changes.trim()}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Generating...' : 'Generate Message'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {(result || loading) && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Commit Message</h2>
            {result && (
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm bg-dark p-2 rounded-md border border-dark-lighter hover:border-gray-500"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="bg-dark rounded-lg p-6 min-h-[100px] border border-dark-lighter prose prose-invert max-w-none flex items-center justify-center">
            {loading ? (
              <div className="flex items-center text-gray-500 space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>Generating message...</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap font-mono text-lg text-primary-hover font-medium w-full text-center">
                {result}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
