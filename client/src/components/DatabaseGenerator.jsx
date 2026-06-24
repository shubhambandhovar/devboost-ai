import { useState } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check, Database } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'
import ExportButtons from './ExportButtons'

export default function DatabaseGenerator() {
  const [description, setDescription] = useState('')
  const [dbType, setDbType] = useState('PostgreSQL')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const dbTypes = ['PostgreSQL', 'MySQL', 'MongoDB (Mongoose)', 'Prisma', 'SQLite', 'SQL Server', 'Oracle'];

  const handleGenerate = async () => {
    if (!description.trim()) return
    
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const data = await callApi('/generate-database', { description, dbType })
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
        <h2 className="text-xl font-semibold mb-4 text-white">Database Schema & SQL Generator</h2>
        <p className="text-gray-400 text-sm mb-4">Describe the app you are building, and the AI will architect the complete database schema, define relationships, and generate complex SQL queries or ORM models.</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">Target Database / ORM</label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className="input-field cursor-pointer"
            >
              {dbTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='e.g. "I am building a Twitter clone. I need tables for users, tweets, likes, followers, and retweets. I want to be able to get a users timeline sorted by newest first."'
          className="input-field min-h-[150px] text-sm"
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleGenerate} 
            disabled={loading || !description.trim()}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
            {loading ? 'Architecting...' : 'Generate Schema'}
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
            <h2 className="text-xl font-semibold text-white">Generated Architecture</h2>
            {result && (
              <div className="flex items-center gap-3">
                <ExportButtons content={result} filename={`schema-${dbType.toLowerCase()}`} />
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
                <span>Designing your database...</span>
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
