import { useState } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check, ServerCog } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'
import ExportButtons from './ExportButtons'

export default function ArchitecturePlanner() {
  const [requirements, setRequirements] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handlePlan = async () => {
    if (!requirements.trim()) return
    
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const data = await callApi('/plan-architecture', { requirements })
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
        <h2 className="text-xl font-semibold mb-4 text-white">System Design & Architecture Planner</h2>
        <p className="text-gray-400 text-sm mb-4">Describe the application you want to build. Our AI Principal Cloud Architect will design a scalable, secure, and modern infrastructure for it.</p>
        
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder='e.g. "I want to build a real-time collaborative document editor like Google Docs for 100,000 concurrent users. It needs to be highly available and support offline mode."'
          className="input-field min-h-[150px] text-sm"
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handlePlan} 
            disabled={loading || !requirements.trim()}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ServerCog className="w-5 h-5" />}
            {loading ? 'Designing System...' : 'Plan Architecture'}
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
            <h2 className="text-xl font-semibold text-white">Architecture Document</h2>
            {result && (
              <div className="flex items-center gap-3">
                <ExportButtons content={result} filename="architecture-plan" />
                <button 
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm bg-dark p-2 rounded-md border border-dark-lighter hover:border-gray-500 h-[34px]"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
          <div className="bg-dark rounded-lg p-6 min-h-[150px] border border-dark-lighter">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>Architecting cloud infrastructure...</span>
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
