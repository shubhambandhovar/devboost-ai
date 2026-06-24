import { useState, useEffect } from 'react'
import { callApi } from '../utils/api'
import { Loader2, Copy, Check, Database, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'
import ExportButtons from './ExportButtons'
import { useToast } from '../context/ToastContext'

export default function DatabaseGenerator() {
  const [description, setDescription] = useState('')
  const [dbType, setDbType] = useState('PostgreSQL')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  // Visualizer states
  const [activeTab, setActiveTab] = useState('code')
  const [mermaidCode, setMermaidCode] = useState(null)
  const [diagramUrl, setDiagramUrl] = useState(null)
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const dbTypes = ['PostgreSQL', 'MySQL', 'MongoDB (Mongoose)', 'Prisma', 'SQLite', 'SQL Server', 'Oracle'];

  // Extract Mermaid block and convert to URL
  useEffect(() => {
    if (!result) {
      setMermaidCode(null);
      setDiagramUrl(null);
      return;
    }

    // Robust extraction:
    // 1. Try matching a block delimited by ```mermaid ... ``` or ```erDiagram ... ``` or ```er ... ``` (with or without ending backticks)
    let code = null;
    const mermaidBlockMatch = result.match(/```(?:mermaid|erDiagram|er)?\s*(erDiagram[\s\S]*?)(?:```|$)/i);
    if (mermaidBlockMatch) {
      code = mermaidBlockMatch[1].trim();
    } else {
      // 2. Try matching erDiagram directly in the text (with or without ending backticks)
      const erDiagramMatch = result.match(/(erDiagram[\s\S]*?)(?:```|$)/i);
      if (erDiagramMatch) {
        code = erDiagramMatch[1].trim();
      }
    }

    if (code) {
      setMermaidCode(code);
      // Prepend dark theme variables so it fits the UI
      let finalCode = code;
      if (!code.includes('%%{init')) {
        finalCode = `%%{init: {'theme': 'dark', 'themeVariables': { 'background': '#0f172a', 'primaryColor': '#4f46e5', 'lineColor': '#6366f1', 'nodeBorder': '#334155' }}}%%\n${code}`;
      }

      try {
        const base64 = window.btoa(unescape(encodeURIComponent(finalCode)));
        setDiagramUrl(`https://mermaid.ink/svg/${base64}`);
      } catch (e) {
        console.error('Failed to encode Mermaid block:', e);
        setDiagramUrl(null);
      }
    } else {
      setMermaidCode(null);
      setDiagramUrl(null);
    }
    
    // Automatically switch to diagram if valid, otherwise fallback to code
    setActiveTab(code ? 'diagram' : 'code');
    setScale(1);
  }, [result]);

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
      showToast(err.message || 'Failed to generate schema', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    showToast('Schema copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.4))
  const handleResetZoom = () => setScale(1)

  return (
    <div className="space-y-6 animate-fade-in relative">
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
        <div className="card flex flex-col h-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-dark-lighter pb-4 mb-4 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('code')}
                className={`pb-2 px-1 text-sm font-semibold transition-all ${
                  activeTab === 'code' 
                    ? 'border-b-2 border-primary text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Schema Code
              </button>
              {mermaidCode && (
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`pb-2 px-1 text-sm font-semibold transition-all ${
                    activeTab === 'diagram' 
                      ? 'border-b-2 border-primary text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Visual ER Diagram
                </button>
              )}
            </div>

            {result && (
              <div className="flex items-center gap-3">
                <ExportButtons content={result} filename={`schema-${dbType.toLowerCase()}`} />
              </div>
            )}
          </div>

          <div className="bg-dark rounded-lg flex-1 min-h-[400px] border border-dark-lighter relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center absolute inset-0 text-gray-500 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm">Designing database structure & visual models...</span>
              </div>
            ) : activeTab === 'code' ? (
              <div className="p-6 overflow-auto absolute inset-0">
                <MarkdownRenderer content={result} />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col">
                {/* Visualizer Controls */}
                <div className="flex items-center justify-between p-3 border-b border-dark-lighter/50 bg-slate-950/40 relative z-10">
                  <span className="text-xs text-gray-400 font-mono">Interactive Schema Map</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleZoomOut}
                      className="p-1.5 bg-dark hover:bg-dark-lighter text-gray-400 hover:text-white rounded-md border border-dark-lighter transition-all"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-400 font-mono min-w-[40px] text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <button 
                      onClick={handleZoomIn}
                      className="p-1.5 bg-dark hover:bg-dark-lighter text-gray-400 hover:text-white rounded-md border border-dark-lighter transition-all"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleResetZoom}
                      className="p-1.5 bg-dark hover:bg-dark-lighter text-gray-400 hover:text-white rounded-md border border-dark-lighter transition-all"
                      title="Reset View"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsFullscreen(true)}
                      className="p-1.5 bg-dark hover:bg-dark-lighter text-gray-400 hover:text-white rounded-md border border-dark-lighter transition-all"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SVG Render Container */}
                <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-950/30">
                  {diagramUrl ? (
                    <div className="overflow-visible flex items-center justify-center">
                      <img 
                        src={diagramUrl} 
                        alt="ER Diagram" 
                        style={{ 
                          transform: `scale(${scale})`, 
                          transformOrigin: 'center center', 
                          transition: 'transform 0.15s ease-out' 
                        }}
                        className="max-w-none shadow-2xl rounded-lg"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Failed to render visual schema.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-[#090d16]/95 backdrop-blur-md flex flex-col p-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-dark-lighter/50 pb-4 mb-4">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Entity-Relationship Diagram ({dbType})
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleZoomOut}
                  className="p-2 bg-dark hover:bg-dark-lighter text-gray-300 hover:text-white rounded-md border border-dark-lighter transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400 font-mono min-w-[50px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button 
                  onClick={handleZoomIn}
                  className="p-2 bg-dark hover:bg-dark-lighter text-gray-300 hover:text-white rounded-md border border-dark-lighter transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleResetZoom}
                  className="p-2 bg-dark hover:bg-dark-lighter text-gray-300 hover:text-white rounded-md border border-dark-lighter transition-all"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-all flex items-center gap-2 text-sm font-bold shadow-lg"
              >
                <Minimize2 className="w-4 h-4" />
                Exit Fullscreen
              </button>
            </div>
          </div>

          {/* Interactive Screen Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-12 bg-slate-950/20 border border-white/5 rounded-2xl relative">
            {diagramUrl && (
              <div className="overflow-visible flex items-center justify-center">
                <img 
                  src={diagramUrl} 
                  alt="ER Diagram Fullscreen" 
                  style={{ 
                    transform: `scale(${scale})`, 
                    transformOrigin: 'center center', 
                    transition: 'transform 0.15s ease-out' 
                  }}
                  className="max-w-none shadow-2xl rounded-xl bg-slate-900/60 p-4 border border-white/5"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
