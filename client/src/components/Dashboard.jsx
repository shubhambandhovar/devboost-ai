import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, Wand2, ShieldAlert, ServerCog, ArrowRight, Activity, Clock, Zap, Database, FlaskConical, GitCommit, Sparkles, LogIn, LogOut, User, History } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { callApi } from '../utils/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      callApi('/history')
        .then(data => setHistory(data))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  const topTools = [
    { path: '/refactor-code', name: 'Code Refactorer', icon: Wand2, desc: 'Optimize and clean up messy code.' },
    { path: '/scan-security', name: 'Security Scanner', icon: ShieldAlert, desc: 'Find vulnerabilities in your code.' },
    { path: '/plan-architecture', name: 'Architecture Planner', icon: ServerCog, desc: 'Design scalable systems instantly.' },
    { path: '/explain-code', name: 'Code Explainer', icon: Code2, desc: 'Understand complex logic quickly.' },
  ]

  const stats = [
    { label: 'Total Generations', value: user ? history.length : '-', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Active Tools', value: '11', icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Time Saved', value: user ? `${history.length * 15}m` : '-', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' }
  ]

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto">
      {/* Standalone Dashboard Header */}
      <header className="flex items-center justify-between py-4 mb-4 border-b border-dark-lighter">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">DevBoost AI</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/history" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-lighter">
                <History className="w-4 h-4" /> My History
              </Link>
              <div className="h-6 w-px bg-dark-lighter"></div>
              <div className="flex items-center gap-2">
                <div className="bg-dark-lighter p-1.5 rounded-full border border-gray-800">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-300 max-w-[150px] truncate">{user.name}</span>
              </div>
              <button onClick={logout} className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-dark-lighter" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="card bg-gradient-to-br from-dark-lighter to-dark border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Ready to ship code faster? DevBoost AI is your personal engineering team.
            </p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/explain-code')} className="btn-primary">
                Explore Tools
             </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="card flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions / Top Tools */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recommended Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link 
                  key={tool.path} 
                  to={tool.path}
                  className="bg-dark-light border border-dark-lighter p-5 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-dark border border-gray-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 flex-1">
                    {tool.desc}
                  </p>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                    Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Link to="/history" className="text-sm text-primary hover:text-primary/80">View All</Link>
          </div>
          <div className="card h-[300px] overflow-hidden flex flex-col bg-dark-light">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !user ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <p className="text-gray-500 mb-4">Sign in to track your history.</p>
                 <Link to="/login" className="text-primary hover:underline">Log In</Link>
               </div>
            ) : history.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <Activity className="w-8 h-8 text-gray-600 mb-2" />
                 <p className="text-gray-500 text-sm">No activity yet. Start generating!</p>
               </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {history.slice(0, 4).map((item) => (
                  <div key={item._id} className="flex items-start gap-3 p-3 bg-dark rounded-lg border border-transparent hover:border-gray-800 transition-colors">
                    <div className="mt-1">
                      {item.tool === 'Architecture Planner' ? <ServerCog className="w-4 h-4 text-purple-400" /> :
                       item.tool === 'Code Refactorer' ? <Wand2 className="w-4 h-4 text-blue-400" /> :
                       item.tool === 'Security Scan' ? <ShieldAlert className="w-4 h-4 text-red-400" /> :
                       item.tool === 'Database Generator' ? <Database className="w-4 h-4 text-green-400" /> :
                       <Activity className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{item.tool}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
