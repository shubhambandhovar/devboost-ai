import { useState } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

export default function CodeExplainer() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleExplain = async () => {
    if (!code.trim()) return
    
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const data = await callApi('/explain-code', { code })
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
        <h2 className="text-xl font-semibold mb-4 text-white">Code Explainer</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="input-field min-h-[200px] font-mono text-sm"
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleExplain} 
            disabled={loading || !code.trim()}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Analyzing...' : 'Explain Code'}
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
            <h2 className="text-xl font-semibold text-white">Explanation</h2>
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
          <div className="bg-dark rounded-lg p-6 min-h-[150px] border border-dark-lighter">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>Analyzing your code...</span>
              </div>
            ) : (
              <MarkdownRenderer content={result} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
