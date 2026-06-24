import { NavLink, Link } from 'react-router-dom'
import { Code2, FileText, GitCommit, Bug, Sparkles, History as HistoryIcon, LogOut, LogIn, User, Wand2, Languages, Regex, FlaskConical, ShieldAlert, Database, ServerCog, LayoutDashboard, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/pricing', name: 'Pricing & Upgrade', icon: CreditCard },
  { path: '/explain-code', name: 'Code Explainer', icon: Code2 },
  { path: '/refactor-code', name: 'Code Refactorer', icon: Wand2 },
  { path: '/translate-code', name: 'Code Translator', icon: Languages },
  { path: '/generate-regex', name: 'Regex Generator', icon: Regex },
  { path: '/generate-unit-test', name: 'Unit Test Generator', icon: FlaskConical },
  { path: '/scan-security', name: 'Security Scanner', icon: ShieldAlert },
  { path: '/generate-database', name: 'Database Generator', icon: Database },
  { path: '/plan-architecture', name: 'Architecture Planner', icon: ServerCog },
  { path: '/generate-readme', name: 'README Generator', icon: FileText },
  { path: '/generate-commit', name: 'Commit Generator', icon: GitCommit },
  { path: '/debug-bug', name: 'Bug Debugger', icon: Bug },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-dark-light border-r border-dark-lighter flex flex-col h-full">
      <Link to="/dashboard" className="p-6 flex items-center gap-3 border-b border-dark-lighter hover:bg-dark-lighter transition-colors">
        <div className="bg-primary p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">DevBoost AI</span>
      </Link>
      
      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(79,70,229,0.1)] translate-x-1' 
                    : 'text-gray-400 hover:bg-dark-lighter hover:text-gray-200 hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          )
        })}

        {user && (
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(79,70,229,0.1)] translate-x-1' 
                  : 'text-gray-400 hover:bg-dark-lighter hover:text-gray-200 hover:translate-x-1'
              }`
            }
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="font-medium">My History</span>
          </NavLink>
        )}
      </nav>
      
      <div className="p-4 border-t border-dark-lighter bg-dark-light">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="bg-dark p-1.5 rounded-md border border-dark-lighter"><User className="w-4 h-4 text-primary" /></div>
              <span className="truncate max-w-[120px]">{user.name}</span>
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors p-1.5" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="flex items-center justify-center gap-2 w-full py-2 bg-dark border border-dark-lighter hover:border-primary/50 text-gray-300 rounded-lg transition-colors text-sm font-medium">
            <LogIn className="w-4 h-4" />
            Sign In to Save History
          </NavLink>
        )}
      </div>
    </aside>
  )
}
