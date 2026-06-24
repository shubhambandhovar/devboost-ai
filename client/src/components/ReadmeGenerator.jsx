import { useState } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check, Download, GitBranch } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

export default function ReadmeGenerator() {
  const [mode, setMode] = useState('manual') // 'manual' or 'github'
  const [githubUrl, setGithubUrl] = useState('')
  const [formData, setFormData] = useState({
    projectName: '',
    features: '',
    techStack: ''
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      if (mode === 'manual') {
        const data = await callApi('/generate-readme', formData)
        setResult(data.result)
      } else {
        const data = await callApi('/generate-readme-github', { repoUrl: githubUrl })
        setResult(data.result)
      }
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

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isFormValid = mode === 'manual' 
    ? formData.projectName.trim() && formData.features.trim() && formData.techStack.trim()
    : githubUrl.includes('github.com/');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-white">Generate README.md</h2>
        
        <div className="flex gap-4 mb-6 p-1 bg-dark rounded-lg w-fit border border-dark-lighter">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'manual' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setMode('manual')}
          >
            Manual Entry
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'github' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setMode('github')}
          >
            <GitBranch className="w-4 h-4" />
            From GitHub URL
          </button>
        </div>

        {mode === 'manual' ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. DevBoost AI"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Key Features</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="List the main features of your project..."
                className="input-field min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                className="input-field"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">GitHub Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="e.g. https://github.com/username/repository"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll fetch the repository description, topics, and languages directly from the GitHub API to generate a fully customized README.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleGenerate} 
            disabled={loading || !isFormValid}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Generating...' : 'Generate README'}
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
            <h2 className="text-xl font-semibold text-white">Generated Output</h2>
            {result && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm bg-dark p-2 rounded-md border border-dark-lighter hover:border-gray-500"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={handleDownload}
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm bg-dark p-2 rounded-md border border-dark-lighter hover:border-primary/50"
                >
                  <Download className="w-4 h-4" />
                  Download .md
                </button>
              </div>
            )}
          </div>
          <div className="bg-dark rounded-lg p-6 min-h-[150px] border border-dark-lighter">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>Crafting your README...</span>
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
