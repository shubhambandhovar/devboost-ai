import { useState } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check, FlaskConical } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

export default function UnitTestGenerator() {
  const [code, setCode] = useState('')
  const [framework, setFramework] = useState('Jest')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const frameworks = ['Jest', 'Mocha', 'Jasmine', 'Vitest', 'PyTest', 'JUnit', 'RSpec', 'Go Test', 'XUnit', 'NUnit'];

  const handleGenerate = async () => {
    if (!code.trim()) return
    
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const data = await callApi('/generate-unit-test', { code, framework })
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
        <h2 className="text-xl font-semibold mb-4 text-white">Unit Test Generator</h2>
        <p className="text-gray-400 text-sm mb-4">Paste a function or class and select a testing framework. AI will generate a robust test suite covering edge cases.</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">Testing Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="input-field cursor-pointer"
            >
              {frameworks.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste the code to test..."
          className="input-field min-h-[200px] font-mono text-sm"
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleGenerate} 
            disabled={loading || !code.trim()}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FlaskConical className="w-5 h-5" />}
            {loading ? 'Generating...' : 'Generate Tests'}
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
            <h2 className="text-xl font-semibold text-white">Generated Test Suite</h2>
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
                <span>Writing tests...</span>
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
